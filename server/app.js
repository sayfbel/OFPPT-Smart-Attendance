const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formateurRoutes = require('./routes/formateurRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


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


// Error Handling Middleware
const fs = require('fs');
app.use((err, req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${err.stack}\n`;
    fs.appendFileSync(path.join(__dirname, 'error.log'), logMessage);
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


const pool = require('./config/db');

const initScheduleData = async () => {
    try {
        console.log('--- Database Synchronization Protocol Alpha ---');

        // 1. Infrastructure Registry (Filieres, Options, Salles)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS filiere (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                niveau VARCHAR(100) NOT NULL
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filiereId INT NOT NULL,
                nom VARCHAR(255) NOT NULL,
                niveau VARCHAR(100) NOT NULL,
                FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE CASCADE
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS salles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL
            )
        `);

        // 2. Classes Registry
        await pool.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id VARCHAR(50) PRIMARY KEY,
                filiereId INT,
                optionId INT,
                année_scolaire VARCHAR(50) DEFAULT '2025/2026',
                level VARCHAR(50) DEFAULT '1er',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE SET NULL,
                FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE SET NULL
            )
        `);

        // 3. User Registry
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS formateurs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                type ENUM('Parrain', 'Vacataire') DEFAULT 'Parrain',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 4. Class Supervisors (Junction)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS class_supervisors (
                class_id VARCHAR(50),
                formateur_id INT,
                PRIMARY KEY (class_id, formateur_id),
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE
            )
        `);

        // 5. Timetable Matrix
        await pool.query(`
            CREATE TABLE IF NOT EXISTS timetable (
                id INT AUTO_INCREMENT PRIMARY KEY,
                day VARCHAR(20) NOT NULL,
                time VARCHAR(50) NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                formateur_id INT,
                subject VARCHAR(255) NOT NULL,
                room VARCHAR(100) NOT NULL,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL
            )
        `);

        // 6. Reports Matrix
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_code VARCHAR(50) UNIQUE NOT NULL,
                formateur_id INT NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                subject VARCHAR(255) NOT NULL,
                salleId INT,
                heure VARCHAR(100),
                signature LONGTEXT,
                status ENUM('JUSTIFIED', 'UNJUSTIFIED') DEFAULT 'UNJUSTIFIED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE,
                FOREIGN KEY (salleId) REFERENCES salles(id) ON DELETE SET NULL
            )
        `);

        // 7. Stagiaires Registry
        await pool.query(`
            CREATE TABLE IF NOT EXISTS stagiaires (
                NumInscription INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                class_id VARCHAR(50),
                Année VARCHAR(50) DEFAULT '1er',
                filiereId INT,
                optionId INT,
                Active BOOLEAN DEFAULT TRUE,
                profession VARCHAR(255) DEFAULT 'stagiaire',
                qr_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
                FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE SET NULL,
                FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE SET NULL
            )
        `);

        // 8. Attendance Grid
        await pool.query(`
            CREATE TABLE IF NOT EXISTS report_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_id INT NOT NULL,
                student_id INT NOT NULL,
                status ENUM('PRESENT', 'ABSENT') NOT NULL,
                Justifier BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE
            )
        `);

        // 9. Live Presence Matrix
        await pool.query(`
            CREATE TABLE IF NOT EXISTS active_checkins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY (student_id, class_id),
                FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE
            )
        `);

        // 10. Neural Notifications
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NULL,
                formateur_id INT NULL,
                type ENUM('request', 'message', 'alert', 'success') DEFAULT 'message',
                category VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                message TEXT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE
            )
        `);

        // 11. Legacy Data Migration & Deletion Protocol
        const [usersExist] = await pool.query("SHOW TABLES LIKE 'users'");
        if (usersExist.length > 0) {
            console.log('--- Executing Legacy Data Migration Protocol ---');
            
            // Move Admin data
            await pool.query(`
                INSERT IGNORE INTO admins (name, email, password, created_at)
                SELECT name, email, password, created_at FROM users WHERE role = 'admin'
            `);

            // Move Formateur data
            await pool.query(`
                INSERT IGNORE INTO formateurs (name, email, password, created_at)
                SELECT name, email, password, created_at FROM users WHERE role = 'formateur'
            `);

            // Move Stagiaire data
            await pool.query(`
                INSERT IGNORE INTO stagiaires (name, class_id, created_at)
                SELECT name, class_id, created_at FROM users WHERE role = 'stagiaire'
            `);

            // Migrate class assignments for formateurs
            await pool.query(`
                INSERT IGNORE INTO class_supervisors (class_id, formateur_id)
                SELECT u.class_id, f.id 
                FROM users u 
                JOIN formateurs f ON u.email = f.email
                WHERE u.role = 'formateur' AND u.class_id IS NOT NULL
            `);

            // Final purge of the legacy table
            await pool.query('DROP TABLE users');
            console.log('✅ Legacy migration complete. "users" table has been purged.');
        }

        // Seeding Infrastructure if empty
        const [filieres] = await pool.query('SELECT COUNT(*) as count FROM filiere');
        if (filieres[0].count === 0) {
            await pool.query(`INSERT INTO filiere (nom, niveau) VALUES 
                ('Développement Digital', 'TS'),
                ('Infrastructure Digitale', 'TS')`);
        }

        const [opts] = await pool.query('SELECT COUNT(*) as count FROM options');
        if (opts[0].count === 0) {
            const [[devDigital]] = await pool.query('SELECT id FROM filiere WHERE nom = "Développement Digital" LIMIT 1');
            const [[infraDigital]] = await pool.query('SELECT id FROM filiere WHERE nom = "Infrastructure Digitale" LIMIT 1');
            
            if (devDigital) {
                await pool.query('INSERT INTO options (filiereId, nom, niveau) VALUES (?, ?, ?)', [devDigital.id, 'Full Stack Web Dev', 'TS']);
            }
            if (infraDigital) {
                await pool.query('INSERT INTO options (filiereId, nom, niveau) VALUES (?, ?, ?)', [infraDigital.id, 'Infrastructure Digitale', 'TS']);
            }
        }

        const [sallesCount] = await pool.query('SELECT COUNT(*) as count FROM salles');
        if (sallesCount[0].count === 0) {
            await pool.query("INSERT INTO salles (nom) VALUES ('SALLE 1'), ('SALLE 2'), ('SALLE 3'), ('SALLE 4'), ('S-D-A')");
        }

        // Seeding Classes
        const [existing] = await pool.query('SELECT COUNT(*) as count FROM classes');
        if (existing[0].count === 0) {
            const [[optDev]] = await pool.query('SELECT id, filiereId FROM options WHERE nom = "Full Stack Web Dev" LIMIT 1');
            const [[optInfra]] = await pool.query('SELECT id, filiereId FROM options WHERE nom = "Infrastructure Digitale" LIMIT 1');

            if (optDev) {
                await pool.query('INSERT INTO classes (id, filiereId, optionId, année_scolaire, level) VALUES (?, ?, ?, ?, ?)', ['DEV101', optDev.filiereId, optDev.id, '2025/2026', '1er']);
                await pool.query('INSERT INTO classes (id, filiereId, optionId, année_scolaire, level) VALUES (?, ?, ?, ?, ?)', ['DEV102', optDev.filiereId, optDev.id, '2025/2026', '2eme']);
            }
            if (optInfra) {
                await pool.query('INSERT INTO classes (id, filiereId, optionId, année_scolaire, level) VALUES (?, ?, ?, ?, ?)', ['ID101', optInfra.filiereId, optInfra.id, '2025/2026', '1er']);
            }
        }

            const bcrypt = require('bcryptjs');

            // Seed Admin
            const adminHash = await bcrypt.hash('admin123', 10);
            await pool.query(`
                INSERT INTO admins (name, email, password) 
                VALUES ('System Admin', 'admin@ofppt.ma', '${adminHash}')
                ON DUPLICATE KEY UPDATE password = '${adminHash}'
            `);

            // Seed Formateurs
            const drAlamiEmail = 'alami@ofppt.ma';
            const drAlamiPwd = await bcrypt.hash(drAlamiEmail.split('@')[0], 10);
            await pool.query(`INSERT IGNORE INTO formateurs (name, email, password) VALUES ('Dr. Alami', ?, ?)`, [drAlamiEmail, drAlamiPwd]);

            const leilaEmail = 'filali@ofppt.ma';
            const leilaPwd = await bcrypt.hash(leilaEmail.split('@')[0], 10);
            await pool.query(`INSERT IGNORE INTO formateurs (name, email, password) VALUES ('Leila Filali', ?, ?)`, [leilaEmail, leilaPwd]);

            const [[formateur]] = await pool.query('SELECT id FROM formateurs LIMIT 1');
            const [[squadron]] = await pool.query('SELECT id FROM classes LIMIT 1');
            if (formateur && squadron) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [squadron.id, formateur.id]);
                await pool.query(
                    'INSERT INTO timetable (day, time, class_id, formateur_id, subject, room) VALUES (?, ?, ?, ?, ?, ?)',
                    ['THURSDAY', '04:30 - 06:30', squadron.id, formateur.id, 'NEURAL INTERFACE LAB', 'ROOM_B101']
                );
        }
        console.log('✅ Database synchronized with separate tables.');
    } catch (err) {
        console.error('Failed to synchronize database:', err);
    }
};

initScheduleData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
