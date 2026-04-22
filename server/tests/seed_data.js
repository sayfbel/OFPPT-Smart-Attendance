const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
    console.log('🌱 Starting Database Seeding...');
    try {
        // 0. Disable foreign key checks for thorough cleanup if needed
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Optional: Clear existing data to start fresh (Uncomment if preferred)
        // console.log('🧹 Cleaning up old data...');
        // await pool.query('TRUNCATE TABLE active_checkins');
        // await pool.query('TRUNCATE TABLE report_attendance');
        // await pool.query('TRUNCATE TABLE reports');
        // await pool.query('TRUNCATE TABLE groups_supervisors');
        // await pool.query('TRUNCATE TABLE stagiaires');
        // await pool.query('TRUNCATE TABLE group_salles');
        // await pool.query('TRUNCATE TABLE groups');
        // await pool.query('TRUNCATE TABLE salles');
        // await pool.query('TRUNCATE TABLE filiere');
        // await pool.query('TRUNCATE TABLE formateurs');

        // 1. Seed Filières (10)
        console.log('📚 Seeding 10 Filières...');
        const filieres = [
            'Développement Digital - Option Web FullStack',
            'Infrastructure Digitale - Opzione Cloud',
            'Gestion des Entreprises',
            'Marketing Digital',
            'Intelligence Artificielle',
            'Cybersécurité',
            'Design Graphique',
            'Comptabilité & Finance',
            'Systèmes Embarqués',
            'Commerce International'
        ];
        const filiereIds = [];
        for (const f of filieres) {
            const [res] = await pool.query('INSERT INTO filiere (nom) VALUES (?)', [f]);
            filiereIds.push(res.insertId);
        }

        // 2. Seed Salles (5)
        console.log('🏫 Seeding 5 Salles...');
        const salleIds = [];
        for (let i = 1; i <= 5; i++) {
            const [res] = await pool.query('INSERT INTO salles (nom) VALUES (?)', [`SALLE ${String(i).padStart(2, '0')}`]);
            salleIds.push(res.insertId);
        }

        // 3. Seed Formateurs (5)
        console.log('👨‍🏫 Seeding 5 Formateurs...');
        const formateurNames = ['Ahmed Alami', 'Sara Bennani', 'Youssef Idrisi', 'Kenza Mansouri', 'Omar Tazi'];
        const formateurIds = [];
        const hashedPassword = await bcrypt.hash('password123', 10);
        for (const name of formateurNames) {
            const email = name.toLowerCase().replace(' ', '.') + '@ofppt.ma';
            const [res] = await pool.query(
                'INSERT INTO formateurs (name, email, password, type) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 'Parrain']
            );
            formateurIds.push(res.insertId);
        }

        // 4. Seed Groupes (20)
        console.log('👥 Seeding 20 Groupes...');
        const groupIds = [];
        for (let i = 1; i <= 20; i++) {
            const groupId = `DEV${100 + i}`;
            const filiereId = filiereIds[(i - 1) % filiereIds.length];
            await pool.query('INSERT INTO groups (id, filiereId, annee_scolaire) VALUES (?, ?, ?)', [groupId, filiereId, '2025/2026']);
            groupIds.push(groupId);

            // Assign a random formateur as supervisor
            const formateurId = formateurIds[Math.floor(Math.random() * formateurIds.length)];
            await pool.query('INSERT INTO groups_supervisors (group_id, formateur_id) VALUES (?, ?)', [groupId, formateurId]);

            // Assign random salle
            const salleId = salleIds[Math.floor(Math.random() * salleIds.length)];
            await pool.query('INSERT INTO group_salles (group_id, salle_id) VALUES (?, ?)', [groupId, salleId]);
        }

        // 5. Seed Stagiaires (25 per group = 500 total)
        console.log('👨‍🎓 Seeding 500 Stagiaires (25 per group)...');
        const firstNames = ['Hamza', 'Layla', 'Mehdi', 'Oumaima', 'Reda', 'Salma', 'Zaid', 'Aya', 'Driss', 'Fatima', 'Anas', 'Ines'];
        const lastNames = ['Fassi', 'Iraqi', 'Slaoui', 'Mekouar', 'Jabrane', 'Tazi', 'Berrada', 'Ghazali'];

        for (const groupId of groupIds) {
            const [[groupInfo]] = await pool.query('SELECT filiereId FROM groups WHERE id = ?', [groupId]);
            const queries = [];
            for (let j = 1; j <= 25; j++) {
                const numInsc = `${groupId}-${String(j).padStart(2, '0')}`;
                const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
                queries.push(pool.query(
                    'INSERT INTO stagiaires (NumInscription, name, group_id, filiereId) VALUES (?, ?, ?, ?)',
                    [numInsc, name, groupId, groupInfo.filiereId]
                ));
            }
            // Use Promise.all for each group to speed up
            await Promise.all(queries);
        }

        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Seeding Completed Successfully!');
        console.log(`📊 Statistics: 
           - 10 Filières
           - 5 Salles
           - 20 Groupes
           - 5 Formateurs
           - 500 Stagiaires`);

    } catch (err) {
        console.error('❌ Seeding Failed!');
        console.error(err);
    } finally {
        process.exit();
    }
}

seed();
