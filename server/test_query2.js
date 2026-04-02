const pool = require('./config/db');

async function test() {
    try {
        const [rows] = await pool.query(`
            SELECT ra.student_id, ra.status, r.date, CURDATE() as cur, r.class_id
            FROM report_attendance ra 
            JOIN reports r ON ra.report_id = r.id 
        `);
        console.log("All report attendance:", rows);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
test();
