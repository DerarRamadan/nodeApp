const express = require('express');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const db = require('../models/db');

    const router = express.Router();
    const secretKey = 'your-secret-key'; // Replace with a strong secret key

    // User Signup
    router.post('/signup', async (req, res) => {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error signing up:', err);
          return res.status(500).send('Error signing up.');
        }
        res.status(201).send('User created successfully.');
      });
    });

    // User Login
    router.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], async (err, results) => {
        if (err) {
          console.error('Error logging in:', err);
          return res.status(500).send('Error logging in.');
        }
        if (results.length === 0) {
          return res.status(401).send('Invalid credentials.');
        }
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).send('Invalid credentials.');
        }
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      });
    });

    module.exports = router;
