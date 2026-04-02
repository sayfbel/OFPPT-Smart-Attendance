const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ofppt_attendance',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log('✅ Connected to MySQL Database: ' + (process.env.DB_NAME || 'ofppt_attendance'));
        conn.release();
    })
    .catch(err => {
        console.error('❌ Database Connection Failed! Make sure XAMPP MySQL is running.');
        console.error(err.message);
    });

module.exports = pool;
