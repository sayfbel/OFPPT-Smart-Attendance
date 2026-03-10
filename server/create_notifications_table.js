const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const createTable = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ofppt_attendance'
    });

    try {
        console.log('--- Creating Notifications Table ---');

        await connection.query(`
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
            );
        `);

        console.log('✅ Notifications table created successfully!');

    } catch (err) {
        console.error('❌ Error creating table:', err.message);
    } finally {
        await connection.end();
        process.exit();
    }
};

createTable();
