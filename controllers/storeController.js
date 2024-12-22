const express = require('express');
    const jwt = require('jsonwebtoken');
    const { v4: uuidv4 } = require('uuid');
    const db = require('../models/db');

    const router = express.Router();
    const secretKey = 'your-secret-key'; // Replace with a strong secret key

    // Middleware to verify JWT token
    const verifyToken = (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).send('No token provided.');
      }

      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).send('Failed to authenticate token.');
        }
        req.userId = decoded.userId;
        next();
      });
    };

    // Create Store
    router.post('/stores', verifyToken, (req, res) => {
      const { name } = req.body;
      const storeId = uuidv4();
      const activationKey = uuidv4();
      const sql = 'INSERT INTO stores (id, name, user_id, activation_key) VALUES (?, ?, ?, ?)';
      db.query(sql, [storeId, name, req.userId, activationKey], (err, result) => {
        if (err) {
          console.error('Error creating store:', err);
          return res.status(500).send('Error creating store.');
        }
        res.status(201).json({ id: storeId, name, activationKey });
      });
    });

    // Edit Store Name
    router.put('/stores/:id', verifyToken, (req, res) => {
      const { id } = req.params;
      const { name } = req.body;
      const sql = 'UPDATE stores SET name = ? WHERE id = ? AND user_id = ?';
      db.query(sql, [name, id, req.userId], (err, result) => {
        if (err) {
          console.error('Error updating store:', err);
          return res.status(500).send('Error updating store.');
        }
        if (result.affectedRows === 0) {
          return res.status(404).send('Store not found or unauthorized.');
        }
        res.status(200).send('Store updated successfully.');
      });
    });

    // Delete Store
    router.delete('/stores/:id', verifyToken, (req, res) => {
      const { id } = req.params;
      const sql = 'DELETE FROM stores WHERE id = ? AND user_id = ?';
      db.query(sql, [id, req.userId], (err, result) => {
        if (err) {
          console.error('Error deleting store:', err);
          return res.status(500).send('Error deleting store.');
        }
        if (result.affectedRows === 0) {
          return res.status(404).send('Store not found or unauthorized.');
        }
        res.status(200).send('Store deleted successfully.');
      });
    });

    // Activate Store
    router.post('/stores/activate', (req, res) => {
      const { activationKey } = req.body;
      const sql = 'UPDATE stores SET is_active = TRUE WHERE activation_key = ?';
      db.query(sql, [activationKey], (err, result) => {
        if (err) {
          console.error('Error activating store:', err);
          return res.status(500).send('Error activating store.');
        }
        if (result.affectedRows === 0) {
          return res.status(404).send('Invalid activation key.');
        }
        const sql2 = 'SELECT * FROM stores WHERE activation_key = ?';
        db.query(sql2, [activationKey], (err, store) => {
          if (err) {
            console.error('Error fetching store:', err);
            return res.status(500).send('Error fetching store.');
          }
          res.status(200).json(store[0]);
        });
      });
    });

    // Get all stores
    router.get('/stores', (req, res) => {
      const sql = 'SELECT * FROM stores';
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error fetching stores:', err);
          return res.status(500).send('Error fetching stores.');
        }
        res.status(200).json(results);
      });
    });

    // Get stores for the authenticated user
    router.get('/stores/me', verifyToken, (req, res) => {
      const sql = 'SELECT * FROM stores WHERE user_id = ?';
      db.query(sql, [req.userId], (err, results) => {
        if (err) {
          console.error('Error fetching user stores:', err);
          return res.status(500).send('Error fetching user stores.');
        }
        res.status(200).json(results);
      });
    });

    module.exports = router;
