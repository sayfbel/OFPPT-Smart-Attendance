const db = require('./config/db');

async function checkTables() {
    try {
        const [rows] = await db.execute('SHOW TABLES');
        console.log('Tables in database:', rows.map(r => Object.values(r)[0]));
        
        try {
            const [cols] = await db.execute('DESCRIBE admins');
            console.log('Admins table columns:', cols.map(c => c.Field));
        } catch (e) {
            console.error('Error describing admins table:', e.message);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkTables();
