const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function reinit() {
    try {
        console.log('--- Database Emergency Re-initialization ---');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server.');

        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('⏳ Executing database.sql contents...');
        await connection.query(sql);
        
        console.log('✅ Database ofppt_attendance has been rebuilt successfully.');
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to re-initialize database:', err.message);
        process.exit(1);
    }
}

reinit();
