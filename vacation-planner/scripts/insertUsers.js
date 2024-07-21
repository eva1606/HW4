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
    { username: 'eva', password: 'eva1', access_code: '1235' },
    { username: 'lola', password: 'lola2', access_code: '1236' },
    { username: 'shyrel', password: 'shyrel3', access_code: '1237' },
    { username: 'emma', password: 'emma4', access_code: '1234' },
    { username: 'ava', password: 'ava5', access_code: '1238' }
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
