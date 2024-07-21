const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: '148.66.138.145',
  user: 'dbusrShnkr24',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error: ', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;
