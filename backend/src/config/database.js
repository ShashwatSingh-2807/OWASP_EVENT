const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'chai_tycoon.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      day_number INTEGER DEFAULT 1,
      budget REAL DEFAULT 500,
      chai_price REAL DEFAULT 12,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL,
      ingredient TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit_cost REAL NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL,
      day INTEGER NOT NULL,
      cups_sold INTEGER NOT NULL,
      price_per_cup REAL NOT NULL,
      revenue REAL NOT NULL,
      cost REAL NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS daily_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL,
      day INTEGER NOT NULL,
      total_revenue REAL NOT NULL,
      total_cost REAL NOT NULL,
      profit REAL NOT NULL,
      cups_sold INTEGER NOT NULL,
      cups_unsold INTEGER NOT NULL,
      customer_rating REAL NOT NULL,
      weather TEXT NOT NULL,
      rush_hour_bonus REAL NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS shock_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL,
      day INTEGER NOT NULL,
      ingredient TEXT NOT NULL,
      old_price REAL NOT NULL,
      new_price REAL NOT NULL,
      player_decision TEXT,
      FOREIGN KEY (game_id) REFERENCES games(id)
    );
  `);

  console.log('Database initialized successfully');
}

module.exports = { db, initializeDatabase };

