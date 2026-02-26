const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function seed() {
    try {
        console.log("Seeding data...");
        // Ensure classes DEV101 and DEV102 exist in `classes`
        await db.query(`INSERT IGNORE INTO classes (class_name) VALUES ('DEV101'), ('DEV102')`);

        const [classes] = await db.query('SELECT * FROM classes');
        const classMap = {};
        for (let c of classes) {
            classMap[c.class_name] = c.id;
        }

        const dev101Id = classMap['DEV101'];
        const dev102Id = classMap['DEV102'];

        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // STAGIAIRES
        const stags = [
            { name: 'saif belfaquir', email: 'saif.belfaquir@stagiaire.ma' },
            { name: 'mouad test', email: 'mouad.test@stagiaire.ma' },
            { name: 'bilal htiti', email: 'bilal.htiti@stagiaire.ma' },
            { name: 'mohamed ozhar', email: 'mohamed.ozhar@stagiaire.ma' }
        ];

        for (let s of stags) {
            const [existing] = await db.query(`SELECT id FROM users WHERE email=?`, [s.email]);
            let userId;
            if (existing.length === 0) {
                const [res] = await db.query(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'stagiaire')`, [s.name, s.email, hashedPassword]);
                userId = res.insertId;
                const qrValue = `QR-${s.name.replace(/\s/g, '').toUpperCase()}`;
                await db.query(`INSERT INTO stagiaires (user_id, class_id, qr_code_value) VALUES (?, ?, ?)`, [userId, dev101Id, qrValue]);
            }
        }

        // FORMATEURS
        const forms = [
            { name: 'BENTALEB SAAD', email: 'saad.bentaleb@formateur.ma' },
            { name: 'ADARDOUR HASSAN', email: 'hassan.adardour@formateur.ma' }
        ];

        for (let f of forms) {
            const [existing] = await db.query(`SELECT id FROM users WHERE email=?`, [f.email]);
            let userId;
            if (existing.length === 0) {
                const [res] = await db.query(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'formateur')`, [f.name, f.email, hashedPassword]);
                userId = res.insertId;
                const [fRes] = await db.query(`INSERT INTO formateurs (user_id) VALUES (?)`, [userId]);
                const formateurId = fRes.insertId;

                await db.query(`INSERT INTO formateur_classes (formateur_id, class_id) VALUES (?, ?)`, [formateurId, dev101Id]);
                await db.query(`INSERT INTO formateur_classes (formateur_id, class_id) VALUES (?, ?)`, [formateurId, dev102Id]);
            }
        }

        console.log("Seeding complete. Default password is 'password123'.");
    } catch (e) {
        console.error("Error seeding DB:", e);
    }
}
module.exports = seed;
