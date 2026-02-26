const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formateurRoutes = require('./routes/formateurRoutes');
const stagiaireRoutes = require('./routes/stagiaireRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/formateur', formateurRoutes);
app.use('/api/stagiaire', stagiaireRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const pool = require('./config/db');

const initScheduleData = async () => {
    try {
        console.log('--- Database Synchronization Protocol Alpha ---');

        // 1. Classes Registry
        await pool.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                stream VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Class Supervisors (Junction)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS class_supervisors (
                class_id VARCHAR(50),
                formateur_id INT,
                PRIMARY KEY (class_id, formateur_id),
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
            )
        `);

        // 3. Timetable Matrix
        await pool.query(`
            CREATE TABLE IF NOT EXISTS timetable (
                id INT AUTO_INCREMENT PRIMARY KEY,
                day VARCHAR(20) NOT NULL,
                time VARCHAR(50) NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                formateur_id INT,
                subject VARCHAR(255) NOT NULL,
                room VARCHAR(100) NOT NULL,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
            )
        `);

        // 4. Reports Matrix
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_code VARCHAR(50) UNIQUE NOT NULL,
                formateur_id INT NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                subject VARCHAR(255) NOT NULL,
                salle VARCHAR(100),
                heure VARCHAR(100),
                status ENUM('JUSTIFIED', 'UNJUSTIFIED') DEFAULT 'UNJUSTIFIED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
            )
        `);

        // 5. Attendance Grid
        await pool.query(`
            CREATE TABLE IF NOT EXISTS report_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_id INT NOT NULL,
                student_id INT NOT NULL,
                status ENUM('PRESENT', 'ABSENT') NOT NULL,
                FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
            )
        `);

        // 6. Neural Profile Extension
        try {
            await pool.query('ALTER TABLE users ADD COLUMN image LONGTEXT');
            console.log('✅ Users table extended with image column.');
        } catch (colErr) { }

        // 7. Live Presence Matrix
        await pool.query(`
            CREATE TABLE IF NOT EXISTS active_checkins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY (student_id, class_id),
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Live Presence Matrix initialized.');

        // Legacy check / Seeding
        const [existing] = await pool.query('SELECT COUNT(*) as count FROM classes');
        if (existing[0].count === 0) {
            console.log('--- Initializing Operational Data ---');

            await pool.query(`
                INSERT INTO classes (id, title, stream) VALUES 
                ('DEV101', 'DEV101', 'Full Stack Web Dev'),
                ('DEV102', 'DEV102', 'Full Stack Web Dev'),
                ('ID101', 'ID101', 'Infrastructure Digitale')
            `);

            // Seed initial timetable
            const timetableData = [
                { day: 'MONDAY', time: '16:30 - 18:30', class: 'DEV101', subject: 'Présentiel', room: 'CFACE' },
                { day: 'TUESDAY', time: '08:30 - 13:30', class: 'DEV101', subject: 'Présentiel', room: 'Salle TDI' }
            ];

            for (let s of timetableData) {
                await pool.query(`INSERT INTO timetable (day, time, class_id, subject, room) VALUES (?, ?, ?, ?, ?)`, [s.day, s.time, s.class, s.subject, s.room]);
            }

            // Seed specific users requested by user
            const bcrypt = require('bcryptjs');
            const pwd = await bcrypt.hash('password123', 10);

            // 2 Formateurs
            await pool.query(`
                INSERT IGNORE INTO users (name, email, password, role) VALUES 
                ('Dr. Alami', 'alami@ofppt.ma', '${pwd}', 'formateur'),
                ('Leila Filali', 'filali@ofppt.ma', '${pwd}', 'formateur')
            `);

            // 4 Stagiaires
            await pool.query(`
                INSERT IGNORE INTO users (name, email, password, role, class_id) VALUES 
                ('Omar Student', 'omar@student.ma', '${pwd}', 'stagiaire', 'DEV101'),
                ('Sara Student', 'sara@student.ma', '${pwd}', 'stagiaire', 'DEV101'),
                ('Karim Student', 'karim@student.ma', '${pwd}', 'stagiaire', 'DEV102'),
                ('Hind Student', 'hind@student.ma', '${pwd}', 'stagiaire', 'DEV102')
            `);

            // Ensure System Admin exists with admin123
            const adminHash = await bcrypt.hash('admin123', 10);
            await pool.query(`
                INSERT INTO users (name, email, password, role) 
                VALUES ('System Admin', 'admin@ofppt.ma', '${adminHash}', 'admin')
                ON DUPLICATE KEY UPDATE password = '${adminHash}'
            `);

            // Seed a "Working" session for THURSDAY (Current Time simulation)
            // Current is ~05:13. Let's set 04:30 - 06:30
            const [[formateur]] = await pool.query('SELECT id FROM users WHERE role = "formateur" LIMIT 1');
            const [[squadron]] = await pool.query('SELECT id FROM classes LIMIT 1');
            if (formateur && squadron) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [squadron.id, formateur.id]);
                await pool.query('DELETE FROM timetable WHERE day = "THURSDAY" AND time = "04:30 - 06:30"');
                await pool.query(
                    'INSERT INTO timetable (day, time, class_id, formateur_id, subject, room) VALUES (?, ?, ?, ?, ?, ?)',
                    ['THURSDAY', '04:30 - 06:30', squadron.id, formateur.id, 'NEURAL INTERFACE LAB', 'ROOM_B101']
                );
            }

            console.log('✅ Base registry synchronized with requested users and test session.');
        }

        // Always ensure System Admin exists with admin123
        const bcrypt = require('bcryptjs');
        const adminHash = await bcrypt.hash('admin123', 10);
        await pool.query(`
            INSERT INTO users (name, email, password, role) 
            VALUES ('System Admin', 'admin@ofppt.ma', '${adminHash}', 'admin')
            ON DUPLICATE KEY UPDATE password = '${adminHash}'
        `);
        console.log('✅ Admin credentials synchronized.');

        // 6. SYNC LIVE SESSION FOR ALAMI (THURSDAY 06:00 - 11:00 for DEV101)
        const [[drAlami]] = await pool.query('SELECT id FROM users WHERE email = "alami@ofppt.ma"');
        const [[dev101]] = await pool.query('SELECT id FROM classes WHERE id = "DEV101"');

        if (drAlami && dev101) {
            await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [dev101.id, drAlami.id]);
            await pool.query('DELETE FROM timetable WHERE day = "THURSDAY" AND class_id = "DEV101"');
            await pool.query(
                'INSERT INTO timetable (day, time, class_id, formateur_id, subject, room) VALUES (?, ?, ?, ?, ?, ?)',
                ['THURSDAY', '06:00 - 11:00', dev101.id, drAlami.id, 'ADVANCED NEURAL SYSTEMS', 'LAB_REDOX']
            );
            console.log(`✅ Targeted Test Session Active: THURSDAY 06:00 - 11:00 for Dr. Alami (DEV101)`);
        }
    } catch (err) {
        console.error('Failed to synchronize database:', err);
    }
};

initScheduleData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
