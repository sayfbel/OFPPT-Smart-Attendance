const pool = require('../config/db');

async function checkConnection() {
    console.log('🔍 Testing Database Connection...');
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('✅ Connection Successful! 1 + 1 =', rows[0].solution);
        
        const [tables] = await pool.query('SHOW TABLES');
        console.log('📋 Database Tables Found:', tables.length);
        tables.forEach(t => console.log('   -', Object.values(t)[0]));
        
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Details:', err.message);
    } finally {
        process.exit();
    }
}

checkConnection();
