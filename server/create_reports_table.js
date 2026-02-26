const pool = require('./config/db');

async function createReportsTables() {
    try {
        console.log("--- Creating Reports Tables ---");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_code VARCHAR(50) UNIQUE NOT NULL,
                formateur_name VARCHAR(255) NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                subject VARCHAR(255) NOT NULL,
                salle VARCHAR(100),
                heure VARCHAR(100),
                status ENUM('JUSTIFIED', 'UNJUSTIFIED') DEFAULT 'UNJUSTIFIED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES available_classes(id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS report_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_id INT NOT NULL,
                student_name VARCHAR(255) NOT NULL,
                student_id VARCHAR(50) NOT NULL,
                status ENUM('PRESENT', 'ABSENT') NOT NULL,
                FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
            )
        `);

        console.log("✅ Reports tables verified/created.");

        // Optional: Insert some dummy data for testing the GET endpoint
        const [existing] = await pool.query('SELECT count(*) as count FROM reports');
        if (existing[0].count === 0) {
            console.log("Seeding dummy reports...");
            const [res] = await pool.query(`
                INSERT INTO reports (report_code, formateur_name, class_id, date, subject, salle, heure, status)
                VALUES 
                ('REC-A01', 'Dr. Alami', 'DEV101', '2023-10-24', 'React Frontend', 'LAB-01', '08:30 - 10:30', 'UNJUSTIFIED'),
                ('REC-A02', 'Leila Filali', 'DEV102', '2023-10-25', 'Node.js Backend', 'LAB-02', '10:30 - 12:30', 'JUSTIFIED')
            `);

            const report1Id = res.insertId;
            const report2Id = res.insertId + 1;

            await pool.query(`
                INSERT INTO report_attendance (report_id, student_name, student_id, status)
                VALUES 
                (?, 'Omar Lazrak', 'US-001', 'PRESENT'),
                (?, 'Sara Bennani', 'US-002', 'ABSENT'),
                (?, 'Karim Tazi', 'US-003', 'ABSENT'),
                (?, 'Fatima Zahra', 'US-004', 'PRESENT')
            `, [report1Id, report1Id, report2Id, report2Id]);

            console.log("✅ Dummy reports seeded.");
        }

    } catch (err) {
        console.error("❌ Error creating reports tables:", err.message);
    } finally {
        process.exit();
    }
}

createReportsTables();
