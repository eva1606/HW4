const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const saltRounds = 10;
const secretKey = process.env.SECRET_KEY;

exports.register = (req, res) => {
  const { username, password } = req.body;
  const accessCode = uuidv4();

  db.query('SELECT * FROM tbl_12_users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username already exists' });

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error' });
      db.query('INSERT INTO tbl_12_users (id, username, password, access_code) VALUES (?, ?, ?, ?)', [null, username, hash, accessCode], (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });
        res.status(201).json({ message: 'User registered successfully', accessCode });
      });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM tbl_12_users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error' });
      if (!result) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, accessCode: user.access_code }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    });
  });
};
