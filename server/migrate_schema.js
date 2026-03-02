const pool = require('./config/db');

const migrate = async () => {
    try {
        console.log("--- Starting Neural Schema Migration ---");

        // Add image column if not exists
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS image TEXT DEFAULT NULL
        `);
        console.log("✅ Column 'image' verified/added.");

        // Add face_id column if not exists
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS face_id JSON DEFAULT NULL
        `);
        console.log("✅ Column 'face_id' verified/added.");

        console.log("✅ Migration Protocol Complete.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration Failed:", err.message);
        process.exit(1);
    }
};

migrate();
