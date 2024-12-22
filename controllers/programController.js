const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../models/db');

const router = express.Router();

const secretKey = 'your-secret-key'; // Replace with a strong secret key

const queriesDir = path.join(__dirname, '../db_queries');

// Ensure the db_queries directory exists
if (!fs.existsSync(queriesDir)) {
  fs.mkdirSync(queriesDir);
}

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, queriesDir);
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

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

// Add a new program with its DB queries file
router.post('/programs', verifyToken, upload.single('dbFile'), (req, res) => {
  const { name } = req.body;
  const fileName = req.file.filename;
  const fileType = path.extname(req.file.originalname).substring(1);
  const fileSize = req.file.size;

  const sql = 'INSERT INTO programs (name, db_file, file_type, file_size) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, fileName, fileType, fileSize], (err, result) => {
    if (err) {
      console.error('Error adding program:', err);
      fs.unlinkSync(req.file.path); // Remove the file if DB insert fails
      return res.status(500).send('Error adding program.');
    }
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      db_file: fileName,
      file_type: fileType,
      file_size: fileSize 
    });
  });
});

// Delete a program and its DB queries file
router.delete('/programs/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT db_file FROM programs WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching program file for deletion:', err);
      return res.status(500).send('Error fetching program file for deletion.');
    }

    if (results.length === 0) {
      return res.status(404).send('Program not found.');
    }

    const fileName = results[0].db_file;
    const filePath = path.join(queriesDir, fileName);

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting program file:', err);
        return res.status(500).send('Error deleting program file.');
      }

      // Delete the program from the database
      const deleteSql = 'DELETE FROM programs WHERE id = ?';
      db.query(deleteSql, [id], (err, result) => {
        if (err) {
          console.error('Error deleting program from DB:', err);
          return res.status(500).send('Error deleting program from DB.');
        }
        res.status(200).send('Program deleted successfully.');
      });
    });
  });
});

// Get all programs
router.get('/programs', (req, res) => {
  const sql = 'SELECT * FROM programs';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching programs:', err);
      return res.status(500).send('Error fetching programs.');
    }
    res.status(200).json(results);
  });
});

// Download a query file associated with the specified program ID
router.get('/programs/query/:programId', (req, res) => {
  const { programId } = req.params;
  const sql = 'SELECT name, db_file, file_type, file_size FROM programs WHERE id = ?';

  db.query(sql, [programId], (err, results) => {
    if (err) {
      console.error('Error fetching program file:', err);
      return res.status(500).send('Error fetching program file.');
    }

    if (results.length === 0) {
      return res.status(404).send('Program not found.');
    }

    const { name, db_file: fileName, file_type: fileType, file_size: fileSize } = results[0];
    const filePath = path.join(queriesDir, fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found.');
    }

    // Add file information to response headers
    const fileInfo = {
      programName: name,
      fileName: `${name}.${fileType}`,
      fileType,
      fileSize
    };
    
    res.setHeader('X-File-Info', JSON.stringify(fileInfo));
    
    // Send the file to the client with original name and extension
    const downloadName = `${name}.${fileType}`;
    res.download(filePath, downloadName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).send('Error sending file.');
      }
    });
  });
});

module.exports = router;
