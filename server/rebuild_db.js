const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const rebuild = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        const dbName = process.env.DB_NAME || 'ofppt_attendance';
        console.log(`--- Rebuilding Database: ${dbName} ---`);

        await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
        await connection.query(`CREATE DATABASE \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);

        // 1. Classes (The Clusters)
        await connection.query(`
            CREATE TABLE classes (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                stream VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Users (Central Records)
        await connection.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'formateur', 'stagiaire') NOT NULL,
                class_id VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
            );
        `);

        // 3. Class Supervisors (Junction for multiple formateurs per class)
        await connection.query(`
            CREATE TABLE class_supervisors (
                class_id VARCHAR(50),
                formateur_id INT,
                PRIMARY KEY (class_id, formateur_id),
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // 4. Timetable (The Matrix)
        await connection.query(`
            CREATE TABLE timetable (
                id INT AUTO_INCREMENT PRIMARY KEY,
                day VARCHAR(20) NOT NULL,
                time VARCHAR(50) NOT NULL,
                class_id VARCHAR(50) NOT NULL,
                formateur_id INT,
                subject VARCHAR(255) NOT NULL,
                room VARCHAR(100) NOT NULL,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES users(id) ON DELETE SET NULL
            );
        `);

        // 5. Absence Reports (Manifests)
        await connection.query(`
            CREATE TABLE reports (
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
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                FOREIGN KEY (formateur_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // 6. Attendance Tracking (Neural Links)
        await connection.query(`
            CREATE TABLE report_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                report_id INT NOT NULL,
                student_id INT NOT NULL,
                status ENUM('PRESENT', 'ABSENT') NOT NULL,
                FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // --- SEEDING ---
        console.log('--- Seeding Optimized Data ---');

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const formateurPassword = await bcrypt.hash('formateur123', 10);
        const studentPassword = await bcrypt.hash('student123', 10);

        // Seed Classes
        await connection.query(`
            INSERT INTO classes (id, title, stream) VALUES 
            ('DEV101', 'DEV101', 'Full Stack Web Dev'),
            ('DEV102', 'DEV102', 'Full Stack Web Dev'),
            ('ID101', 'ID101', 'Infrastructure Digitale');
        `);

        // Seed Users
        await connection.query(`
            INSERT INTO users (name, email, password, role) VALUES 
            ('System Admin', 'admin@ofppt.ma', '${hashedPassword}', 'admin');
        `);

        // Seed Formateurs
        const [formateurResult] = await connection.query(`
            INSERT INTO users (name, email, password, role) VALUES 
            ('Dr. Alami', 'alami@ofppt.ma', '${formateurPassword}', 'formateur'),
            ('Leila Filali', 'filali@ofppt.ma', '${formateurPassword}', 'formateur'),
            ('Ahmed Tazi', 'tazi@ofppt.ma', '${formateurPassword}', 'formateur');
        `);
        const firstFormateurId = formateurResult.insertId;

        // Seed Students
        await connection.query(`
            INSERT INTO users (name, email, password, role, class_id) VALUES 
            ('Omar Lazrak', 'omar@student.ma', '${studentPassword}', 'stagiaire', 'DEV101'),
            ('Sara Bennani', 'sara@student.ma', '${studentPassword}', 'stagiaire', 'DEV101'),
            ('Karim Tazi', 'karim@student.ma', '${studentPassword}', 'stagiaire', 'DEV102');
        `);

        // Link Supervisors
        await connection.query(`
            INSERT INTO class_supervisors (class_id, formateur_id) VALUES 
            ('DEV101', ${firstFormateurId}),
            ('DEV101', ${firstFormateurId + 1}),
            ('DEV102', ${firstFormateurId + 1});
        `);

        // Seed Timetable
        await connection.query(`
            INSERT INTO timetable (day, time, class_id, formateur_id, subject, room) VALUES 
            ('MONDAY', '08:30 - 10:30', 'DEV101', ${firstFormateurId}, 'React Frontend', 'Lab A1'),
            ('TUESDAY', '10:30 - 12:30', 'DEV101', ${firstFormateurId + 1}, 'Node.js Backend', 'Lab B2');
        `);

        console.log('✅ Database rebuild and optimization complete!');

    } catch (err) {
        console.error('❌ Rebuild error:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
};

rebuild();
