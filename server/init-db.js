const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const init = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        console.log('--- Database Initialization ---');

        // Create DB
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ofppt_attendance'}\`;`);
        await connection.query(`USE \`${process.env.DB_NAME || 'ofppt_attendance'}\`;`);

        // 1. Classes Registry
        await connection.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                stream VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Users (Central Records)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
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
        // ... (skipping others as they are in database.sql for full setup)

        // Seed Admin
        const email = 'admin@ofppt.ma';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);

        if (existing.length === 0) {
            await connection.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin', email, hashedPassword, 'admin']
            );
            console.log('✅ Admin user created: admin@ofppt.ma / admin123');
        } else {
            // Update password just in case it was wrong
            await connection.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, email]
            );
            console.log('✅ Admin credentials updated.');
        }

        console.log('🎉 System Ready! You can now log in.');

    } catch (err) {
        console.error('❌ Init error:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
};

init();
