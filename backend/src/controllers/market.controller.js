const { db } = require('../config/database');

exports.getPrices = (req, res, next) => {
  try {
    const { gameId } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const inventory = db.prepare('SELECT ingredient, quantity, unit_cost FROM inventory WHERE game_id = ?').all(gameId);

    res.json({
      success: true,
      data: {
        chaiPrice: game.chai_price,
        ingredients: inventory,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.buyIngredient = (req, res, next) => {
  try {
    const { gameId, ingredient, quantity } = req.body;

    if (!gameId || !ingredient || !quantity || quantity <= 0) {
      const error = new Error('gameId, ingredient, and a positive quantity are required');
      error.statusCode = 400;
      throw error;
    }

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const item = db.prepare(
      'SELECT * FROM inventory WHERE game_id = ? AND ingredient = ?'
    ).get(gameId, ingredient);
    if (!item) {
      const error = new Error(`Ingredient "${ingredient}" not found in inventory`);
      error.statusCode = 404;
      throw error;
    }

    const totalCost = quantity * item.unit_cost;
    if (totalCost > game.budget) {
      const error = new Error(`Insufficient budget. Need ₹${totalCost.toFixed(2)}, have ₹${game.budget.toFixed(2)}`);
      error.statusCode = 400;
      throw error;
    }

    db.prepare('UPDATE games SET budget = budget - ? WHERE id = ?').run(totalCost, gameId);
    db.prepare('UPDATE inventory SET quantity = quantity + ? WHERE game_id = ? AND ingredient = ?').run(quantity, gameId, ingredient);

    const updatedGame = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    const updatedInventory = db.prepare('SELECT * FROM inventory WHERE game_id = ?').all(gameId);

    res.json({
      success: true,
      data: {
        game: updatedGame,
        inventory: updatedInventory,
        purchased: { ingredient, quantity, totalCost },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.setPrice = (req, res, next) => {
  try {
    const { gameId, pricePerCup } = req.body;

    if (!gameId || pricePerCup == null || pricePerCup <= 0) {
      const error = new Error('gameId and a positive pricePerCup are required');
      error.statusCode = 400;
      throw error;
    }

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    db.prepare('UPDATE games SET chai_price = ? WHERE id = ?').run(pricePerCup, gameId);
    const updatedGame = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);

    res.json({
      success: true,
      data: { game: updatedGame },
    });
  } catch (err) {
    next(err);
  }
};

