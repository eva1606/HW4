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

  console.log('Registering user:', username);

  db.query('SELECT * FROM tbl_12_users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error selecting user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0) {
      console.log('Username already exists:', username);
      return res.status(400).json({ error: 'Username already exists' });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      db.query('INSERT INTO tbl_12_users (username, password, access_code) VALUES (?, ?, ?)', [username, hash, accessCode], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log('User registered successfully:', username);
        res.status(201).json({ message: 'User registered successfully', accessCode });
      });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  console.log('Logging in user:', username);

  db.query('SELECT * FROM tbl_12_users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error selecting user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      console.log('Invalid credentials:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!result) {
        console.log('Invalid credentials:', username);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, accessCode: user.access_code }, secretKey, { expiresIn: '1h' });
      console.log('User logged in successfully:', username);
      res.json({ token });
    });
  });
};
