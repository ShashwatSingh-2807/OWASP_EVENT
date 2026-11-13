const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_INVENTORY = [
  { ingredient: 'tea_leaves', quantity: 200, unit_cost: 0.40 },
  { ingredient: 'milk', quantity: 5, unit_cost: 60 },
  { ingredient: 'sugar', quantity: 1, unit_cost: 50 },
  { ingredient: 'cups', quantity: 100, unit_cost: 1 },
];

exports.startGame = (req, res, next) => {
  try {
    const gameId = uuidv4();

    const insertGame = db.prepare(
      'INSERT INTO games (id, day_number, budget, chai_price) VALUES (?, 1, 500, 12)'
    );
    insertGame.run(gameId);

    const insertInventory = db.prepare(
      'INSERT INTO inventory (game_id, ingredient, quantity, unit_cost) VALUES (?, ?, ?, ?)'
    );
    const seedInventory = db.transaction(() => {
      for (const item of DEFAULT_INVENTORY) {
        insertInventory.run(gameId, item.ingredient, item.quantity, item.unit_cost);
      }
    });
    seedInventory();

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    const inventory = db.prepare('SELECT * FROM inventory WHERE game_id = ?').all(gameId);

    res.status(201).json({
      success: true,
      data: {
        game,
        inventory,
        dailyReports: [],
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getGameState = (req, res, next) => {
  try {
    const { gameId } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const inventory = db.prepare('SELECT * FROM inventory WHERE game_id = ?').all(gameId);
    const dailyReports = db.prepare(
      'SELECT * FROM daily_reports WHERE game_id = ? ORDER BY day ASC'
    ).all(gameId);

    res.json({
      success: true,
      data: {
        game,
        inventory,
        dailyReports,
      },
    });
  } catch (err) {
    next(err);
  }
};

