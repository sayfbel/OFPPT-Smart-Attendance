const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const fixData = async () => {
    try {
        console.log('--- Fixing Database Data per Request ---');

        // 1. Clean up titles
        await pool.query("UPDATE classes SET title = REPLACE(title, ' - SQUADRON', '')");
        await pool.query("UPDATE classes SET title = REPLACE(title, ' - CLUSTER', '')");
        console.log('✅ Class titles cleaned up.');

        const pwd = await bcrypt.hash('password123', 10);

        // 2. Create 2 Formateurs if they don't exist
        const formateurs = [
            { name: 'Dr. Alami', email: 'alami@ofppt.ma' },
            { name: 'Leila Filali', email: 'filali@ofppt.ma' }
        ];

        for (const f of formateurs) {
            await pool.query(`
                INSERT INTO users (name, email, password, role) 
                VALUES (?, ?, ?, 'formateur')
                ON DUPLICATE KEY UPDATE name=VALUES(name)
            `, [f.name, f.email, pwd]);
        }
        console.log('✅ 2 Formateurs synchronized.');

        // 3. Create 4 Stagiaires
        const students = [
            { name: 'Omar Student', email: 'omar@student.ma', class_id: 'DEV101' },
            { name: 'Sara Student', email: 'sara@student.ma', class_id: 'DEV101' },
            { name: 'Karim Student', email: 'karim@student.ma', class_id: 'DEV102' },
            { name: 'Hind Student', email: 'hind@student.ma', class_id: 'DEV102' }
        ];

        for (const s of students) {
            await pool.query(`
                INSERT INTO users (name, email, password, role, class_id) 
                VALUES (?, ?, ?, 'stagiaire', ?)
                ON DUPLICATE KEY UPDATE class_id=VALUES(class_id)
            `, [s.name, s.email, pwd, s.class_id]);
        }
        console.log('✅ 4 Stagiaires synchronized.');

        process.exit();
    } catch (err) {
        console.error('❌ Error fixing data:', err.message);
        process.exit(1);
    }
};

fixData();
