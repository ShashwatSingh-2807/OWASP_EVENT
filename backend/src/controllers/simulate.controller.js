const { db } = require('../config/database');

const WEATHER_OPTIONS = ['sunny', 'rainy', 'cold'];
const WEATHER_MULT = { sunny: 0.8, rainy: 1.0, cold: 1.5 };
const RECIPE_PER_CUP = { tea_leaves: 5, milk: 0.05, sugar: 0.01, cups: 1 };
const BASE_DEMAND = 100;

function getInventoryMap(gameId) {
  const rows = db.prepare('SELECT ingredient, quantity, unit_cost FROM inventory WHERE game_id = ?').all(gameId);
  const map = {};
  for (const r of rows) {
    map[r.ingredient] = { quantity: r.quantity, unit_cost: r.unit_cost };
  }
  return map;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function calculateDemand(chaiPrice, weather) {
  const weatherMult = WEATHER_MULT[weather];
  const rushHour = randomBetween(1.1, 1.4);
  const priceSensitivity = Math.max(0, 1 - (chaiPrice - 10) * 0.05);
  const actualDemand = Math.floor(BASE_DEMAND * weatherMult * rushHour * priceSensitivity);
  return { actualDemand, rushHour, weatherMult, priceSensitivity };
}

exports.runSimulation = (req, res, next) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      const error = new Error('gameId is required');
      error.statusCode = 400;
      throw error;
    }

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const chaiPrice = game.chai_price;
    const currentDay = game.day_number;

    // Pick random weather
    const weather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];

    // Calculate demand
    const { actualDemand, rushHour } = calculateDemand(chaiPrice, weather);

    // Get inventory
    const inv = getInventoryMap(gameId);

    // Calculate max cups from stock
    const maxFromTea = inv.tea_leaves ? Math.floor(inv.tea_leaves.quantity / RECIPE_PER_CUP.tea_leaves) : 0;
    const maxFromMilk = inv.milk ? Math.floor(inv.milk.quantity / RECIPE_PER_CUP.milk) : 0;
    const maxFromSugar = inv.sugar ? Math.floor(inv.sugar.quantity / RECIPE_PER_CUP.sugar) : 0;
    const maxFromCups = inv.cups ? Math.floor(inv.cups.quantity / RECIPE_PER_CUP.cups) : 0;
    const maxCupsFromStock = Math.min(maxFromTea, maxFromMilk, maxFromSugar, maxFromCups);

    const cupsSold = Math.min(actualDemand, maxCupsFromStock);
    const cupsUnsold = actualDemand - cupsSold;

    // Cost per cup based on current unit costs
    const costPerCup =
      RECIPE_PER_CUP.tea_leaves * (inv.tea_leaves?.unit_cost || 0.40) +
      RECIPE_PER_CUP.milk * (inv.milk?.unit_cost || 60) +
      RECIPE_PER_CUP.sugar * (inv.sugar?.unit_cost || 50) +
      RECIPE_PER_CUP.cups * (inv.cups?.unit_cost || 1);

    const totalCost = cupsSold * costPerCup + 50; // 50 overhead
    const totalRevenue = cupsSold * chaiPrice;
    const profit = totalRevenue - totalCost;

    // Rating
    let rating = 3.5;
    if (chaiPrice < 15) rating += 0.5;
    if (chaiPrice > 25) rating -= 0.3;
    rating += randomBetween(-0.3, 0.3);
    rating = Math.round(Math.max(1, Math.min(5, rating)) * 10) / 10;

    // Update in a transaction
    const runDay = db.transaction(() => {
      // Update budget
      db.prepare('UPDATE games SET budget = budget + ?, day_number = day_number + 1 WHERE id = ?')
        .run(profit, gameId);

      // Deduct inventory
      for (const [ingredient, perCup] of Object.entries(RECIPE_PER_CUP)) {
        const used = cupsSold * perCup;
        db.prepare('UPDATE inventory SET quantity = quantity - ? WHERE game_id = ? AND ingredient = ?')
          .run(used, gameId, ingredient);
      }

      // Insert transaction
      db.prepare(
        'INSERT INTO transactions (game_id, day, cups_sold, price_per_cup, revenue, cost) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(gameId, currentDay, cupsSold, chaiPrice, totalRevenue, totalCost);

      // Insert daily report
      db.prepare(
        `INSERT INTO daily_reports (game_id, day, total_revenue, total_cost, profit, cups_sold, cups_unsold, customer_rating, weather, rush_hour_bonus)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(gameId, currentDay, totalRevenue, totalCost, profit, cupsSold, cupsUnsold, rating, weather, rushHour);
    });

    runDay();

    const updatedGame = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);

    res.json({
      success: true,
      data: {
        day: currentDay,
        weather,
        rushHour: Math.round(rushHour * 100) / 100,
        cupsSold,
        cupsUnsold,
        revenue: Math.round(totalRevenue * 100) / 100,
        cost: Math.round(totalCost * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        rating,
        budget: Math.round(updatedGame.budget * 100) / 100,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.previewDemand = (req, res, next) => {
  try {
    const { gameId } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const inv = getInventoryMap(gameId);
    const chaiPrice = game.chai_price;

    // Calculate for each weather scenario
    const previews = WEATHER_OPTIONS.map((weather) => {
      const weatherMult = WEATHER_MULT[weather];
      const avgRushHour = 1.25; // midpoint of 1.1–1.4
      const priceSensitivity = Math.max(0, 1 - (chaiPrice - 10) * 0.05);
      const expectedDemand = Math.floor(BASE_DEMAND * weatherMult * avgRushHour * priceSensitivity);
      return { weather, expectedDemand };
    });

    const maxFromTea = inv.tea_leaves ? Math.floor(inv.tea_leaves.quantity / RECIPE_PER_CUP.tea_leaves) : 0;
    const maxFromMilk = inv.milk ? Math.floor(inv.milk.quantity / RECIPE_PER_CUP.milk) : 0;
    const maxFromSugar = inv.sugar ? Math.floor(inv.sugar.quantity / RECIPE_PER_CUP.sugar) : 0;
    const maxFromCups = inv.cups ? Math.floor(inv.cups.quantity / RECIPE_PER_CUP.cups) : 0;
    const maxCupsFromStock = Math.min(maxFromTea, maxFromMilk, maxFromSugar, maxFromCups);

    res.json({
      success: true,
      data: {
        currentPrice: chaiPrice,
        maxCupsFromStock,
        demandByWeather: previews,
        inventory: inv,
      },
    });
  } catch (err) {
    next(err);
  }
};

