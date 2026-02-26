const pool = require('./config/db');

async function migrate() {
    try {
        console.log('Starting migration: adding image column to users table...');
        await pool.query('ALTER TABLE users ADD COLUMN image LONGTEXT;');
        console.log('✅ Migration successful: image column added.');
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('ℹ️ Column "image" already exists.');
            process.exit(0);
        }
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
