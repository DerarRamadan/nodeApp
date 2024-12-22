const mysql = require('mysql');

    const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'store_management'
    });

    db.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL database');
      // Create tables if not exists
      db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
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

      db.query(`
        CREATE TABLE IF NOT EXISTS stores (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          user_id INT NOT NULL,
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

      db.query(`
        CREATE TABLE IF NOT EXISTS programs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          file_type VARCHAR(50) NOT NULL,
          file_size BIGINT NOT NULL,
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
