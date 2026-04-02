const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formateurRoutes = require('./routes/formateurRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
<<<<<<< HEAD
const errorMiddleware = require('./middlewares/errorMiddleware');
=======
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files - Neural Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/formateur', formateurRoutes);
app.use('/api/notifications', notificationRoutes);


<<<<<<< HEAD
// Central Error Response Node
app.use(errorMiddleware);
=======
// Error Handling Middleware
const fs = require('fs');
app.use((err, req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${err.stack}\n`;
    fs.appendFileSync(path.join(__dirname, 'error.log'), logMessage);
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e


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

<<<<<<< HEAD
=======
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
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

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
                signature LONGTEXT,
                status ENUM('JUSTIFIED', 'UNJUSTIFIED') DEFAULT 'UNJUSTIFIED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
            )
        `);

        // Ensure signature exists in reports
        try {
            await pool.query('ALTER TABLE reports ADD COLUMN signature LONGTEXT');
        } catch (err) { }

        // 5. Attendance Grid
        await pool.query(`
            CREATE TABLE IF NOT EXISTS report_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_id INT NOT NULL,
                student_id INT NOT NULL,
                status ENUM('PRESENT', 'ABSENT') NOT NULL,
                FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES stagiaires(id) ON DELETE CASCADE
            )
        `);

        // 6. Stagiaires Registry
        await pool.query(`
            CREATE TABLE IF NOT EXISTS stagiaires (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                class_id VARCHAR(50),
                institute VARCHAR(255) DEFAULT 'OFPPT ISTA Mirleft',
                year VARCHAR(50) DEFAULT '2025/2026',
                profession VARCHAR(255) DEFAULT 'stagiaire',
                qr_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
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
                FOREIGN KEY (student_id) REFERENCES stagiaires(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Live Presence Matrix initialized.');

        // 8. Neural Notifications (Memory Node)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                type ENUM('request', 'message', 'alert', 'success') DEFAULT 'message',
                category VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                message TEXT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Neural Notifications Registry initialized.');

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

<<<<<<< HEAD
=======
            // Seed initial timetable
            const timetableData = [
                { day: 'LUNDI', time: '16:30 - 18:30', class: 'DEV101', subject: 'Présentiel', room: 'CFACE' },
                { day: 'MARDI', time: '08:30 - 13:30', class: 'DEV101', subject: 'Présentiel', room: 'Salle TDI' }
            ];

            for (let s of timetableData) {
                await pool.query(`INSERT INTO timetable (day, time, class_id, subject, room) VALUES (?, ?, ?, ?, ?)`, [s.day, s.time, s.class, s.subject, s.room]);
            }
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

            // Seed specific users requested by user
            const bcrypt = require('bcryptjs');
            const pwd = await bcrypt.hash('password123', 10);

            // 2 Formateurs
            const drAlamiEmail = 'alami@ofppt.ma';
            const drAlamiPwd = await bcrypt.hash(drAlamiEmail.split('@')[0], 10);
            await pool.query(`INSERT IGNORE INTO users (name, email, password, role) VALUES ('Dr. Alami', ?, ?, 'formateur')`, [drAlamiEmail, drAlamiPwd]);

            const leilaEmail = 'filali@ofppt.ma';
            const leilaPwd = await bcrypt.hash(leilaEmail.split('@')[0], 10);
            await pool.query(`INSERT IGNORE INTO users (name, email, password, role) VALUES ('Leila Filali', ?, ?, 'formateur')`, [leilaEmail, leilaPwd]);

            // No Stagiaire seeding here - handled by admin

            // Ensure System Admin exists with admin123
            const adminHash = await bcrypt.hash('admin123', 10);
            await pool.query(`
                INSERT INTO users (name, email, password, role) 
                VALUES ('System Admin', 'admin@ofppt.ma', '${adminHash}', 'admin')
                ON DUPLICATE KEY UPDATE password = '${adminHash}'
            `);

<<<<<<< HEAD
=======
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
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

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

<<<<<<< HEAD
=======
        // 6. SYNC LIVE SESSION FOR ALAMI (THURSDAY 06:00 - 11:00 for DEV101)
        const [alamiRows] = await pool.query('SELECT id FROM users WHERE email = "alami@ofppt.ma"');
        const [classRows] = await pool.query('SELECT id FROM classes WHERE id = "DEV101"');

        const drAlami = alamiRows[0];
        const dev101 = classRows[0];

        if (drAlami && dev101) {
            await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [dev101.id, drAlami.id]);
            await pool.query('DELETE FROM timetable WHERE day = "THURSDAY" AND class_id = "DEV101"');
            await pool.query(
                'INSERT INTO timetable (day, time, class_id, formateur_id, subject, room) VALUES (?, ?, ?, ?, ?, ?)',
                ['THURSDAY', '06:00 - 11:00', dev101.id, drAlami.id, 'ADVANCED NEURAL SYSTEMS', 'LAB_REDOX']
            );
            console.log(`✅ Targeted Test Session Active: THURSDAY 06:00 - 11:00 for Dr. Alami (DEV101)`);
        }
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

        // Synchronize Identity Schema
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS image LONGTEXT`);

        // 7. SYNC PASSWORDS POLICY (Staff only)
        console.log('--- Syncing Passwords to Email Prefix Protocol ---');
        const [usersToSync] = await pool.query('SELECT id, email FROM users WHERE role IN ("formateur")');
        const bcryptSync = require('bcryptjs');
        for (const u of usersToSync) {
            const prefix = u.email.split('@')[0];
            const hash = await bcryptSync.hash(prefix, 10);
            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, u.id]);
        }
        console.log(`✅ Synced ${usersToSync.length} user passwords.`);

    } catch (err) {
        console.error('Failed to synchronize database:', err);
    }
};

// initScheduleData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
