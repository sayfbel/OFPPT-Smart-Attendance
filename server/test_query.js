const pool = require('./config/db');

async function test() {
    try {
        const classId = 'DEV101'; // Replacing with generic class id visible in screenshot
        const [rows] = await pool.query(`
            SELECT ra.student_id, ra.status, 1 as priority
            FROM report_attendance ra 
            JOIN reports r ON ra.report_id = r.id 
            WHERE r.class_id = ? AND r.date = CURDATE()
            UNION
            SELECT student_id, status, 2 as priority 
            FROM active_checkins 
            WHERE class_id = ?
            ORDER BY priority ASC
        `, [classId, classId]);
        console.log("Checkins fetched:", rows);

        const [reports] = await pool.query(`SELECT * FROM reports WHERE class_id = ?`, [classId]);
        console.log("Existing reports:", reports);

        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
test();
