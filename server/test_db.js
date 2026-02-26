const pool = require('./config/db');

async function test() {
    try {
        console.log("Checking tables...");
        const [classes] = await pool.query('SELECT * FROM available_classes');
        const [schedule] = await pool.query('SELECT s.day, s.time, s.class_id as class, s.formateur, s.subject, s.room FROM schedule s');
        console.log("Classes:", classes.length);
        console.log("Schedule:", schedule.length);
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        process.exit();
    }
}

test();
