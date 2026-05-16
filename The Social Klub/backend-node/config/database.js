const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'social_klub',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

promisePool
  .getConnection()
  .then((conn) => {
    console.log(`Connected to MySQL Database (${process.env.DB_NAME || 'social_klub'})`);
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
  });

module.exports = promisePool;
