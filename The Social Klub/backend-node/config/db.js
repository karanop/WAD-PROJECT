const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: '127.0.0.1',   // 🔥 MUST BE THIS
  user: 'root',
  password: '',        // 🔥 XAMPP default
  database: 'social_klub',
  port: 3306           // 🔥 MUST ADD
});

const promisePool = pool.promise();

promisePool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL Database (social_klub)');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

module.exports = promisePool;
