const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const reset = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'ofppt_attendance',
        });

        const newPassword = 'admin123';
        const hash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
            ['System Admin', 'admin@ofppt.ma', hash, 'admin', hash]
        );

        console.log('✅ Admin credentials reset successful.');
        console.log('Identifier: admin@ofppt.ma');
        console.log('Key: admin123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting admin:', err.message);
        process.exit(1);
    }
};

reset();
