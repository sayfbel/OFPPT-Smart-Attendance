const pool = require('./config/db');

async function migrate() {
    try {
        console.log("Starting migration to add missing 'signature' column...");
        await pool.query("ALTER TABLE reports ADD COLUMN signature LONGTEXT AFTER heure");
        console.log("✅ Success: 'signature' column added to 'reports' table.");
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("ℹ️ Info: 'signature' column already exists.");
        } else {
            console.error("❌ Error during migration:", err.message);
        }
    } finally {
        process.exit();
    }
}

migrate();
