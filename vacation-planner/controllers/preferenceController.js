const db = require('../config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

exports.getPreferences = (req, res) => {
  db.query('SELECT * FROM tbl_12_preferences', (err, results) => {
    if (err) {
      console.error('Error retrieving preferences: ', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
};

exports.savePreferences = (req, res) => {
  const { startDate, endDate, destination, vacationType } = req.body;
  const userId = req.user.id;

  db.query('REPLACE INTO tbl_12_preferences (user_id, startDate, endDate, destination, vacationType) VALUES (?, ?, ?, ?, ?)', 
    [userId, startDate, endDate, destination, vacationType], 
    (err, results) => {
      if (err) {
        console.error('Error upserting preferences: ', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(200).json({ message: 'Preferences saved successfully' });
    }
  );
};

exports.getDestinations = (req, res) => {
  const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/destinations.json')));
  res.json(destinations);
};

exports.getVacationTypes = (req, res) => {
  const vacationTypes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vacationTypes.json')));
  res.json(vacationTypes);
};
