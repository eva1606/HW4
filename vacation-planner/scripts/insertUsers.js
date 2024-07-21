const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

const saltRounds = 10;
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

  const users = [
    { username: 'Eva Levy', password: 'eva16', access_code: '123' },
    { username: 'Shyrel Journo', password: 'Shyrel23', access_code: '234' },
    { username: 'Daniella Elbaz', password: 'Daniella12', access_code: '456' },
    { username: 'Emma Atlan', password: 'Emma09', access_code: '789' },
    { username: 'Shyrel Cohen', password: 'shyrel24', access_code: '910' }
  ];

  users.forEach((user) => {
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
      if (err) {
        console.error('Error hashing password: ', err);
        return;
      }

      connection.query('INSERT INTO tbl_12_users (username, password, access_code) VALUES (?, ?, ?)', 
        [user.username, hash, user.access_code], 
        (err, results) => {
          if (err) {
            console.error('Error inserting user: ', err);
            return;
          }
          console.log('User inserted:', user.username);
        }
      );
    });
  });

  connection.end();
});
