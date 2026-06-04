const pool = require('../config/db');
const { spawn } = require('child_process');
const path = require('path');



exports.submitReport = async (req, res) => {
    try {
        const { report_code, group_id, date, subject, heure, stagiaires, signature } = req.body;
        const formateur_id = req.user.id;

        if (!report_code || !group_id || !date || !subject) {
            return res.status(400).json({ message: 'Required fields missing: report_code, group_id, date, subject' });
        }

        // 1. Create the report record
        const [reportRes] = await pool.query(
            'INSERT INTO reports (report_code, formateur_id, group_id, date, subject, heure, signature) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [report_code, formateur_id, group_id, date, subject, heure, signature]
        );

        const reportId = reportRes.insertId;

        // 2. Save individual attendance records for this report (optimized: only non-present)
        if (stagiaires && stagiaires.length > 0) {
            const nonPresentStagiaires = stagiaires.filter(s => s.status !== 'PRESENT');
            if (nonPresentStagiaires.length > 0) {
                const values = nonPresentStagiaires.map(s => [reportId, s.id, s.status]);
                await pool.query(
                    'INSERT INTO report_attendance (report_id, student_id, status) VALUES ?',
                    [values]
                );
            }
        }

        // 3. Create notification for Admin(s)
        const [admins] = await pool.query('SELECT id FROM admins');
        for (const admin of admins) {
            await pool.query(
                'INSERT INTO notifications (user_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                [
                    admin.id,
                    'message',
                    'RAPPORT',
                    `Nouveau rapport : ${group_id}`,
                    `Le formateur ${req.user.name} a soumis le rapport de présence pour le module ${subject}.`
                ]
            );
        }

        // 4. Clear active checkins since session is concluded
        await pool.query('DELETE FROM active_checkins WHERE group_id = ?', [group_id]);

        res.status(201).json({ message: 'Report submitted successfully', reportId });
    } catch (err) {
        console.error("SUBMIT REPORT ERROR:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Report code already exists' });
        }
        res.status(500).json({ message: 'Server error submitting report' });
    }
};

exports.getGroups = async (req, res) => {
    try {
        const formateur_id = req.user.id;

        // Get groups where this formateur is a supervisor
        const [groups] = await pool.query(`
            SELECT g.* FROM \`groups\` g
            JOIN groups_supervisors gs ON g.id = gs.group_id
            WHERE gs.formateur_id = ?
        `, [formateur_id]);

        res.json({ groups });
    } catch (err) {
        console.error("GET FORMATEUR GROUPS ERROR:", err);
        res.status(500).json({ message: 'Server error fetching groups' });
    }
};

exports.getUsersByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const formateur_id = req.user.id;

        // Verify access: Admin can access all, Formateurs must be supervisors
        if (req.user.role !== 'admin') {
            const [supervisors] = await pool.query(
                'SELECT * FROM groups_supervisors WHERE group_id = ? AND formateur_id = ?',
                [groupId, formateur_id]
            );

            if (supervisors.length === 0) {
                return res.status(403).json({ message: 'Access Denied: You are not a supervisor for this squadron.' });
            }
        }

        const [users] = await pool.query(
            'SELECT NumInscription as id, name, group_id FROM stagiaires WHERE group_id = ?',
            [groupId]
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
        const { studentId, groupId } = req.body;

        // 1. Verify existence
        const [students] = await pool.query('SELECT NumInscription as id, name FROM stagiaires WHERE NumInscription = ? AND group_id = ?', [studentId, groupId]);
        const student = students[0];
        if (!student) {
            return res.status(404).json({ message: 'Entity not found in this cluster.' });
        }

        // 2. Register check-in
        await pool.query('INSERT IGNORE INTO active_checkins (student_id, group_id) VALUES (?, ?)', [studentId, groupId]);

        res.json({ message: `Signal Locked: ${student.name} synchronized.`, name: student.name });
    } catch (err) {
        console.error("CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Neural link interrupted.' });
    }
};

// Neural Portal: Process Check-in by QR Content
exports.processCheckinByQR = async (req, res) => {
    try {
        const { qrContent, groupId } = req.body;

        if (!qrContent) return res.status(400).json({ message: 'No QR signal received.' });

        // Parse format: NAME:xxx|GROUP:yyy|...
        const parts = qrContent.split('|');
        const namePart = parts.find(p => p.startsWith('NAME:'));
        const groupPart = parts.find(p => p.startsWith('GROUP:'));

        if (!namePart || !groupPart) {
            return res.status(400).json({ message: 'Invalid signal format. Cluster mismatch.' });
        }

        const name = namePart.substring(5).trim();
        const group = groupPart.substring(6).trim();

        if (group !== groupId) {
            return res.status(403).json({ message: `Access Denied: Node ${name} belongs to Cluster ${group}.` });
        }

        // Look up student id from name and group
        const normalizedName = name.replace(/_/g, ' ');
        const [students] = await pool.query(
            'SELECT NumInscription as id FROM stagiaires WHERE (LOWER(TRIM(name)) = LOWER(?) OR LOWER(REPLACE(name, " ", "_")) = LOWER(?)) AND group_id = ?', 
            [normalizedName, name, group]
        );
        if (students.length === 0) {
            return res.status(404).json({ message: `L'étudiant "${name}" n'a pas été trouvé dans le groupe ${group}. Veuillez vérifier le code QR.` });
        }

        const studentId = students[0].id;

        // Check if student is locked as ABSENT for the day
        const [locked] = await pool.query(`
            SELECT 1 FROM report_attendance ra
            JOIN reports r ON ra.report_id = r.id
            WHERE r.group_id = ? AND ra.student_id = ? AND DATE(r.date) = CURDATE() AND ra.status = 'ABSENT'
        `, [groupId, studentId]);

        if (locked.length > 0) {
            return res.status(403).json({ message: "L'étudiant est verrouillé comme ABSENT pour aujourd'hui.", name, lockedOut: true });
        }

        // Check if already in active_checkins
        const [existing] = await pool.query('SELECT * FROM active_checkins WHERE student_id = ? AND group_id = ?', [studentId, groupId]);
        if (existing.length > 0) {
            return res.status(200).json({ message: 'Already scanned.', name, alreadyScanned: true });
        }

        // Register in active_checkins
        await pool.query('INSERT IGNORE INTO active_checkins (student_id, group_id) VALUES (?, ?)', [studentId, groupId]);

        res.json({ message: 'Signal Captured: Syncing node...', name, alreadyScanned: false });
    } catch (err) {
        console.error("QR CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Neural link interrupted.' });
    }
};

exports.getActiveCheckins = async (req, res) => {
    try {
        const { groupId } = req.params;
        const [checkins] = await pool.query(`
            SELECT id, status FROM (
                SELECT id, status, ROW_NUMBER() OVER(PARTITION BY id ORDER BY priority ASC) as rank_idx
                FROM (
                    SELECT ra.student_id as id, 'ABSENT' as status, 1 as priority
                    FROM report_attendance ra
                    JOIN reports r ON ra.report_id = r.id
                    WHERE r.group_id = ? AND DATE(r.date) = CURDATE() AND ra.status = 'ABSENT'
                    UNION
                    SELECT student_id as id, status, 2 as priority 
                    FROM active_checkins 
                    WHERE group_id = ?
                ) as raw_data
            ) as ranked_data
            WHERE rank_idx = 1
        `, [groupId, groupId]);
        res.json({ checkins: checkins.map(c => ({ student_id: c.id, status: c.status || 'PRESENT' })) });
    } catch (err) {
        console.error("GET CHECKINS ERROR:", err);
        res.status(500).json({ message: 'Telemetry fetch failure.' });
    }
};

// Neural Portal: Clear Check-ins
exports.clearCheckins = async (req, res) => {
    try {
        const { groupId } = req.body;
        await pool.query('DELETE FROM active_checkins WHERE group_id = ?', [groupId]);
        res.json({ message: 'Active matrix reset.' });
    } catch (err) {
        console.error("CLEAR CHECKINS ERROR:", err);
        res.status(500).json({ message: 'Reset protocol failed.' });
    }
};

// Neural Portal: Manual Status Override
exports.updateCheckinStatus = async (req, res) => {
    try {
        const { studentId, groupId, status } = req.body;

        if (status === 'PRESENT') {
            const [locked] = await pool.query(`
                SELECT 1 FROM report_attendance ra
                JOIN reports r ON ra.report_id = r.id
                WHERE r.group_id = ? AND ra.student_id = ? AND DATE(r.date) = CURDATE() AND ra.status = 'ABSENT'
            `, [groupId, studentId]);

            if (locked.length > 0) {
                return res.status(403).json({ message: "L'étudiant est verrouillé comme ABSENT pour aujourd'hui." });
            }
        }

        await pool.query('DELETE FROM active_checkins WHERE student_id = ? AND group_id = ?', [studentId, groupId]);
        await pool.query(
            'INSERT INTO active_checkins (student_id, group_id, status) VALUES (?, ?, ?)',
            [studentId, groupId, status]
        );

        res.json({ message: `Status synchronized for entity ${studentId}.` });
    } catch (err) {
        console.error("UPDATE CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Neural link interrupted during sync override.' });
    }
};

// Get FORMATEUR profile
exports.getProfile = async (req, res) => {
    try {
        const formateur_id = req.user.id;
        const [profiles] = await pool.query(`
            SELECT u.id, u.name, u.email, 'formateur' as role, u.image 
            FROM formateurs u
            WHERE u.id = ?
        `, [formateur_id]);

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'Neural Node not found.' });
        }

        res.json({ profile: profiles[0] });
    } catch (err) {
        console.error("GET FORMATEUR PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Neural disconnect.' });
    }
};

// Update FORMATEUR profile (specifically image)
exports.updateProfile = async (req, res) => {
    try {
        const formateur_id = req.user.id;
        const { image } = req.body;

        await pool.query('UPDATE formateurs SET image = ? WHERE id = ?', [image, formateur_id]);

        res.json({ message: 'Neural Identity updated.' });
    } catch (err) {
        console.error("UPDATE FORMATEUR PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Identity rewrite failed.' });
    }
};

// Update FORMATEUR profile (specifically name/email)
exports.updateFormateurProfile = async (req, res) => {
    try {
        const formateur_id = req.user.id;
        const { name, email } = req.body;

        await pool.query('UPDATE formateurs SET name = ?, email = ? WHERE id = ?', [name, email, formateur_id]);

        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error("UPDATE FORMATEUR PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update FORMATEUR password
exports.updatePassword = async (req, res) => {
    try {
        const formateur_id = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const bcrypt = require('bcryptjs');

        // 1. Verify current password
        const [users] = await pool.query('SELECT password FROM formateurs WHERE id = ?', [formateur_id]);
        const user = users[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password incorrect.' });
        }

        // 2. Hash and Save new password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE formateurs SET password = ?, first_login = FALSE WHERE id = ?', [hashedPass, formateur_id]);

        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error("UPDATE PASSWORD ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Force update password (first login)
exports.forceUpdatePassword = async (req, res) => {
    try {
        const formateur_id = req.user.id;
        const { newPassword } = req.body;
        const bcrypt = require('bcryptjs');

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE formateurs SET password = ?, first_login = FALSE WHERE id = ?', [hashedPass, formateur_id]);

        res.json({ message: 'Password initialized. Welcome to the platform.' });
    } catch (err) {
        console.error("FORCE UPDATE PASSWORD ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
