const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('store_management.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite:', err);
    return;
  }
  console.log('Connected to SQLite database');
  // Create tables if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS stores (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT FALSE,
      activation_key VARCHAR(255) UNIQUE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creating stores table:', err);
    } else {
      console.log('Stores table created or already exists');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      file_type VARCHAR(50) NOT NULL,
      file_size INTEGER NOT NULL,
      db_file VARCHAR(255) NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error('Error creating programs table:', err);
    } else {
      console.log('Programs table created or already exists');
    }
  });
});

module.exports = db;
