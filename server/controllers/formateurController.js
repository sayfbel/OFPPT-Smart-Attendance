const pool = require('../config/db');

exports.submitReport = async (req, res) => {
    try {
        const { report_code, class_id, date, subject, salle, heure, stagiaires } = req.body;
        const formateur_id = req.user.id;

        if (!report_code || !class_id || !date || !subject) {
            return res.status(400).json({ message: 'Required fields missing: report_code, class_id, date, subject' });
        }

        // 1. Create the report record
        const [reportRes] = await pool.query(
            'INSERT INTO reports (report_code, formateur_id, class_id, date, subject, salle, heure) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [report_code, formateur_id, class_id, date, subject, salle, heure]
        );

        const reportId = reportRes.insertId;

        // 2. Save individual attendance records for this report
        if (stagiaires && stagiaires.length > 0) {
            const values = stagiaires.map(s => [reportId, s.id, s.status]);
            await pool.query(
                'INSERT INTO report_attendance (report_id, student_id, status) VALUES ?',
                [values]
            );
        }

        res.status(201).json({ message: 'Report submitted successfully', reportId });
    } catch (err) {
        console.error("SUBMIT REPORT ERROR:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Report code already exists' });
        }
        res.status(500).json({ message: 'Server error submitting report' });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const formateur_id = req.user.id;

        // Get classes where this formateur is a supervisor
        const [classes] = await pool.query(`
            SELECT c.* FROM classes c
            JOIN class_supervisors cs ON c.id = cs.class_id
            WHERE cs.formateur_id = ?
        `, [formateur_id]);

        // Get schedule for this formateur
        const [schedule] = await pool.query(`
            SELECT t.id, t.day, t.time, t.class_id as class, u.name as formateur, t.subject, t.room 
            FROM timetable t 
            LEFT JOIN users u ON t.formateur_id = u.id
            WHERE t.formateur_id = ?
        `, [formateur_id]);

        res.json({ classes, schedule });
    } catch (err) {
        console.error("GET FORMATEUR SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Server error fetching schedule' });
    }
};

exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const formateur_id = req.user.id;

        // Verify that this formateur supervises this class
        const [[isSupervisor]] = await pool.query(
            'SELECT * FROM class_supervisors WHERE class_id = ? AND formateur_id = ?',
            [classId, formateur_id]
        );

        if (!isSupervisor) {
            return res.status(403).json({ message: 'Access Denied: You are not a supervisor for this squadron.' });
        }

        const [users] = await pool.query(
            'SELECT id, name, email, role, class_id FROM users WHERE class_id = ? AND role = "stagiaire"',
            [classId]
        );

        res.json({ users: users.map(u => ({ ...u, status: 'ACTIVE', lastLogin: 'Connected' })) });
    } catch (err) {
        console.error("GET FORMATEUR USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

// Neural Portal: Process Check-in (QR or Face)
exports.processCheckin = async (req, res) => {
    try {
        const { studentId, classId } = req.body;

        // 1. Verify existence
        const [[student]] = await pool.query('SELECT id, name FROM users WHERE id = ? AND class_id = ?', [studentId, classId]);
        if (!student) {
            return res.status(404).json({ message: 'Entity not found in this cluster.' });
        }

        // 2. Register check-in
        await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [studentId, classId]);

        res.json({ message: `Signal Locked: ${student.name} synchronized.`, name: student.name });
    } catch (err) {
        console.error("CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Neural link interrupted.' });
    }
};

// Neural Portal: Get Active Check-ins for a class
exports.getActiveCheckins = async (req, res) => {
    try {
        const { classId } = req.params;
        const [checkins] = await pool.query('SELECT student_id FROM active_checkins WHERE class_id = ?', [classId]);
        res.json({ checkins: checkins.map(c => c.student_id) });
    } catch (err) {
        console.error("GET CHECKINS ERROR:", err);
        res.status(500).json({ message: 'Telemetry fetch failure.' });
    }
};

// Neural Portal: Clear Check-ins
exports.clearCheckins = async (req, res) => {
    try {
        const { classId } = req.body;
        await pool.query('DELETE FROM active_checkins WHERE class_id = ?', [classId]);
        res.json({ message: 'Active matrix reset.' });
    } catch (err) {
        console.error("CLEAR CHECKINS ERROR:", err);
        res.status(500).json({ message: 'Reset protocol failed.' });
    }
};
