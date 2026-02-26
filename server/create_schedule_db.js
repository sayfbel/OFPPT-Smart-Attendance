const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ofppt_attendance'
    });

    console.log("Connected to DB.");

    await conn.query(`
        CREATE TABLE IF NOT EXISTS available_classes (
            id VARCHAR(50) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            stream VARCHAR(255) NOT NULL,
            lead_formateur VARCHAR(255) NOT NULL
        )
    `);

    await conn.query(`
        CREATE TABLE IF NOT EXISTS schedule (
            id INT AUTO_INCREMENT PRIMARY KEY,
            day VARCHAR(20) NOT NULL,
            time VARCHAR(50) NOT NULL,
            class_id VARCHAR(50) NOT NULL,
            formateur VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            room VARCHAR(100) NOT NULL,
            FOREIGN KEY (class_id) REFERENCES available_classes(id) ON DELETE CASCADE
        )
    `);

    // Clean tables before inserting to avoid duplicates
    await conn.query(`DELETE FROM schedule`);
    await conn.query(`DELETE FROM available_classes`);

    const availableClasses = [
        { id: 'DEV101', title: 'DEV101 - SQUADRON', stream: 'Full Stack Web Dev', lead: 'Dr. Alami' },
        { id: 'DEV102', title: 'DEV102 - SQUADRON', stream: 'Full Stack Web Dev', lead: 'Leila Filali' }
    ];

    for (let c of availableClasses) {
        await conn.query(`INSERT INTO available_classes (id, title, stream, lead_formateur) VALUES (?, ?, ?, ?)`, [c.id, c.title, c.stream, c.lead]);
    }

    const schedule = [
        // DEV101 Schedule
        { day: 'MONDAY', time: '16:30 - 18:30', class: 'DEV101', formateur: 'ETALLAB', subject: 'Présentiel', room: 'CFACE' },
        { day: 'TUESDAY', time: '08:30 - 13:30', class: 'DEV101', formateur: 'BENTALEB SAAD', subject: 'Présentiel', room: 'Salle TDI' },
        { day: 'WEDNESDAY', time: '08:30 - 13:30', class: 'DEV101', formateur: 'BENTALEB SAAD', subject: 'Présentiel', room: 'Salle TDI' },
        { day: 'WEDNESDAY', time: '16:30 - 18:30', class: 'DEV101', formateur: 'BENTALEB SAAD', subject: 'À distance', room: 'Online' },
        { day: 'THURSDAY', time: '08:30 - 10:30', class: 'DEV101', formateur: 'EL BELGHITI', subject: 'Salle PFE', room: 'Salle PFE' },
        { day: 'THURSDAY', time: '13:30 - 18:30', class: 'DEV101', formateur: 'ADARDOUR HASSAN', subject: 'Présentiel', room: 'Salle TDI' },
        { day: 'FRIDAY', time: '16:30 - 18:30', class: 'DEV101', formateur: 'ADARDOUR HASSAN', subject: 'Présentiel / À distance', room: 'Hybride' },
        { day: 'SATURDAY', time: '14:30 - 16:30', class: 'DEV101', formateur: 'BENTALEB SAAD', subject: 'À distance', room: 'Online' },

        // DEV102 Mock Data (fallback so card interaction remains functional)
        { day: 'MONDAY', time: '08:30 - 10:30', class: 'DEV102', formateur: 'Leila Filali', subject: 'Node.js Backend', room: 'Lab B1' },
        { day: 'TUESDAY', time: '10:30 - 12:30', class: 'DEV102', formateur: 'Leila Filali', subject: 'Express Framework', room: 'Lab B1' },
        { day: 'WEDNESDAY', time: '14:30 - 16:30', class: 'DEV102', formateur: 'Ahmed Tazi', subject: 'MongoDB', room: 'Lab C2' },
        { day: 'THURSDAY', time: '08:30 - 10:30', class: 'DEV102', formateur: 'Dr. Alami', subject: 'React Frontend', room: 'Lab A3' },
    ];

    for (let s of schedule) {
        await conn.query(`INSERT INTO schedule (day, time, class_id, formateur, subject, room) VALUES (?, ?, ?, ?, ?, ?)`, [s.day, s.time, s.class, s.formateur, s.subject, s.room]);
    }

    console.log("Data inserted.");
    process.exit(0);
}

run().catch(console.error);
