const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const createFakeSession = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'ofppt_attendance',
        });

        // 1. Get a formateur
        const [[formateur]] = await pool.query('SELECT id, name FROM users WHERE role = "formateur" LIMIT 1');
        if (!formateur) {
            console.error('❌ No formateur found in registry.');
            process.exit(1);
        }

        // 2. Get a class
        const [[squadron]] = await pool.query('SELECT id FROM classes LIMIT 1');
        if (!squadron) {
            console.error('❌ No squadron found in registry.');
            process.exit(1);
        }

        // 3. Ensure supervisor link
        await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [squadron.id, formateur.id]);

        // 4. Create session for THURSDAY (Current day)
        // Current time is 05:13, so let's set 04:30 - 06:30
        const day = 'THURSDAY';
        const time = '04:30 - 06:30';

        await pool.query('DELETE FROM timetable WHERE day = ? AND time = ?', [day, time]);
        await pool.query(
            'INSERT INTO timetable (day, time, class_id, formateur_id, subject, room) VALUES (?, ?, ?, ?, ?, ?)',
            [day, time, squadron.id, formateur.id, 'NEURAL INTERFACE LAB', 'ROOM_B101']
        );

        console.log('✅ Temporary Operational Session Initialized.');
        console.log(`Instruct: Log in as ${formateur.name} or ensure your current node is linked.`);
        console.log(`Session: ${squadron.id} | ${day} | ${time}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating fake session:', err.message);
        process.exit(1);
    }
};

createFakeSession();
