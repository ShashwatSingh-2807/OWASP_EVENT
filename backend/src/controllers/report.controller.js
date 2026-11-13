const { db } = require('../config/database');

exports.getDailyReport = (req, res, next) => {
  try {
    const { gameId, day } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const report = db.prepare(
      'SELECT * FROM daily_reports WHERE game_id = ? AND day = ?'
    ).get(gameId, parseInt(day, 10));

    if (!report) {
      const error = new Error(`No report found for day ${day}`);
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSummary = (req, res, next) => {
  try {
    const { gameId } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      const error = new Error('Game not found');
      error.statusCode = 404;
      throw error;
    }

    const reports = db.prepare(
      'SELECT * FROM daily_reports WHERE game_id = ? ORDER BY day ASC'
    ).all(gameId);

    const totals = reports.reduce(
      (acc, r) => ({
        totalRevenue: acc.totalRevenue + r.total_revenue,
        totalCost: acc.totalCost + r.total_cost,
        totalProfit: acc.totalProfit + r.profit,
        totalCupsSold: acc.totalCupsSold + r.cups_sold,
        avgRating: acc.avgRating + r.customer_rating,
      }),
      { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalCupsSold: 0, avgRating: 0 }
    );

    if (reports.length > 0) {
      totals.avgRating = Math.round((totals.avgRating / reports.length) * 10) / 10;
    }
    totals.totalRevenue = Math.round(totals.totalRevenue * 100) / 100;
    totals.totalCost = Math.round(totals.totalCost * 100) / 100;
    totals.totalProfit = Math.round(totals.totalProfit * 100) / 100;

    res.json({
      success: true,
      data: {
        reports,
        totals,
        daysPlayed: reports.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

