const { db } = require('../config/database');

exports.triggerShock = (req, res, next) => {
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

    const milk = db.prepare(
      "SELECT * FROM inventory WHERE game_id = ? AND ingredient = 'milk'"
    ).get(gameId);

    if (!milk) {
      const error = new Error('Milk not found in inventory');
      error.statusCode = 404;
      throw error;
    }

    const oldPrice = milk.unit_cost;
    const newPrice = oldPrice * 2;

    db.prepare(
      "UPDATE inventory SET unit_cost = ? WHERE game_id = ? AND ingredient = 'milk'"
    ).run(newPrice, gameId);

    db.prepare(
      'INSERT INTO shock_events (game_id, day, ingredient, old_price, new_price) VALUES (?, ?, ?, ?, ?)'
    ).run(gameId, game.day_number, 'milk', oldPrice, newPrice);

    res.json({
      success: true,
      data: {
        event: 'milk_price_shock',
        ingredient: 'milk',
        oldPrice,
        newPrice,
        day: game.day_number,
        message: `Milk prices have doubled from ₹${oldPrice}/L to ₹${newPrice}/L!`,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.decideShock = (req, res, next) => {
  try {
    const { gameId, decision } = req.body;

    if (!gameId || !decision) {
      const error = new Error('gameId and decision are required');
      error.statusCode = 400;
      throw error;
    }

    const validDecisions = ['absorb', 'raise_price', 'substitute'];
    if (!validDecisions.includes(decision)) {
      const error = new Error(`decision must be one of: ${validDecisions.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    // Get latest shock event for this game
    const shock = db.prepare(
      'SELECT * FROM shock_events WHERE game_id = ? ORDER BY id DESC LIMIT 1'
    ).get(gameId);

    if (!shock) {
      const error = new Error('No shock event found for this game');
      error.statusCode = 404;
      throw error;
    }

    // Update shock event with decision
    db.prepare('UPDATE shock_events SET player_decision = ? WHERE id = ?').run(decision, shock.id);

    let resultMessage = '';

    switch (decision) {
      case 'absorb':
        // No price change, rating bonus applied during next simulation
        resultMessage = 'You absorbed the cost increase. Customers appreciate your loyalty! (+0.5 rating next day)';
        break;

      case 'raise_price':
        // Increase chai price by 3
        db.prepare('UPDATE games SET chai_price = chai_price + 3 WHERE id = ?').run(gameId);
        resultMessage = `Chai price raised from ₹${game.chai_price} to ₹${game.chai_price + 3}. Expect ~20% demand drop.`;
        break;

      case 'substitute':
        // Milk cost = old_cost * 1.33 instead of doubled
        const substitutePrice = shock.old_price * 1.33;
        db.prepare(
          "UPDATE inventory SET unit_cost = ? WHERE game_id = ? AND ingredient = 'milk'"
        ).run(substitutePrice, gameId);
        resultMessage = `Switched to substitute milk at ₹${substitutePrice.toFixed(2)}/L (cheaper than doubled price). Rating -0.3.`;
        break;
    }

    const updatedGame = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    const updatedInventory = db.prepare('SELECT * FROM inventory WHERE game_id = ?').all(gameId);

    res.json({
      success: true,
      data: {
        decision,
        message: resultMessage,
        game: updatedGame,
        inventory: updatedInventory,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getShockImpact = (req, res, next) => {
  try {
    const { gameId } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const shocks = db.prepare(
      'SELECT * FROM shock_events WHERE game_id = ? ORDER BY day ASC'
    ).all(gameId);

    // Projected impacts for each decision
    const projectedImpacts = {
      absorb: {
        priceChange: 0,
        ratingChange: +0.5,
        demandChange: 'No change',
        description: 'Keep prices the same and take the hit on margins. Customers stay loyal.',
      },
      raise_price: {
        priceChange: +3,
        ratingChange: 0,
        demandChange: '~20% decrease',
        description: 'Pass the cost to customers. Demand will drop but margins stay healthy.',
      },
      substitute: {
        priceChange: 0,
        ratingChange: -0.3,
        demandChange: 'No change',
        description: 'Use a cheaper alternative. Saves money but taste may suffer.',
      },
    };

    res.json({
      success: true,
      data: {
        shockEvents: shocks,
        projectedImpacts,
      },
    });
  } catch (err) {
    next(err);
  }
};

