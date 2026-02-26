const pool = require('../config/db');

// Get STAGIAIRE profile
exports.getProfile = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [profile] = await pool.query(`
            SELECT u.id, u.name, u.email, u.role, u.class_id, u.image, c.title as class_name, c.stream 
            FROM users u
            LEFT JOIN classes c ON u.class_id = c.id
            WHERE u.id = ?
        `, [student_id]);

        if (profile.length === 0) {
            return res.status(404).json({ message: 'Neural Node not found.' });
        }

        res.json({ profile: profile[0] });
    } catch (err) {
        console.error("GET STAGIAIRE PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Neural disconnect.' });
    }
};

// Get STAGIAIRE schedule based on their class_id
exports.getSchedule = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [[user]] = await pool.query('SELECT class_id FROM users WHERE id = ?', [student_id]);

        if (!user || !user.class_id) {
            return res.status(200).json({ schedule: [] });
        }

        const [schedule] = await pool.query(`
            SELECT t.id, t.day, t.time, t.subject, t.room, u.name as formateur
            FROM timetable t
            LEFT JOIN users u ON t.formateur_id = u.id
            WHERE t.class_id = ?
        `, [user.class_id]);

        res.json({ schedule });
    } catch (err) {
        console.error("GET STAGIAIRE SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Temporal drift.' });
    }
};

// Get STAGIAIRE absences
exports.getAbsences = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [absences] = await pool.query(`
            SELECT ra.id, ra.status, r.date, r.subject, r.heure, r.salle, r.status as record_status
            FROM report_attendance ra
            JOIN reports r ON ra.report_id = r.id
            WHERE ra.student_id = ? AND ra.status = 'ABSENT'
            ORDER BY r.date DESC
        `, [student_id]);

        res.json({ absences });
    } catch (err) {
        console.error("GET STAGIAIRE ABSENCES ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Archive corrupted.' });
    }
};

// Update STAGIAIRE profile (specifically image)
exports.updateProfile = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { image } = req.body;

        await pool.query('UPDATE users SET image = ? WHERE id = ?', [image, student_id]);

        res.json({ message: 'Neural Identity updated.' });
    } catch (err) {
        console.error("UPDATE STAGIAIRE PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Identity rewrite failed.' });
    }
};
