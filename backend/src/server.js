const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const gameRoutes = require('./routes/game.routes');
const marketRoutes = require('./routes/market.routes');
const simulateRoutes = require('./routes/simulate.routes');
const reportRoutes = require('./routes/report.routes');
const shockRoutes = require('./routes/shock.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/simulate', simulateRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/shock', shockRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize DB and start server
initializeDatabase();
app.listen(PORT, () => {
  console.log(`Chai Stall Tycoon backend running on port ${PORT}`);
});

module.exports = app;

