const db = require('./config/db');

async function checkAllTables() {
    try {
        console.log('--- Database Health Check ---');
        const [rows] = await db.execute('SHOW TABLES');
        const tables = rows.map(r => Object.values(r)[0]);
        console.log('Found tables:', tables);

        for (const table of tables) {
            try {
                const [count] = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`✅ Table [${table}]: ${count[0].count} rows`);
            } catch (e) {
                console.error(`❌ Table [${table}] Error:`, e.message);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Fatal Error:', err.message);
        process.exit(1);
    }
}

checkAllTables();
