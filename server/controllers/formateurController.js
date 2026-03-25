const pool = require('../config/db');
const { spawn } = require('child_process');
const path = require('path');

// Neural Scanner Matrix: Active External Processes
const activeScanners = new Map();

exports.startExternalScanner = async (req, res) => {
    try {
        const { classId } = req.body;
        if (!classId) return res.status(400).json({ message: 'Target cluster id is required.' });

        if (activeScanners.has(classId)) {
            return res.json({ message: `Scanner for Cluster ${classId} is already active.` });
        }

        const scriptPath = path.join(__dirname, '../scaning_qr.py');
        const camIdx = process.env.QR_CAMERA_INDEX || '1';
        const scannerProc = spawn('py', [scriptPath, classId, camIdx]);

        activeScanners.set(classId, scannerProc);

        scannerProc.stdout.on('data', async (data) => {
            const rawOutput = data.toString();
            const match = rawOutput.match(/NAME:\s+(.*?)\s+:\s+present/);
            if (match) {
                const studentName = match[1].trim();
                try {
                    const [students] = await pool.query('SELECT NumInscription as id FROM stagiaires WHERE name = ? AND class_id = ?', [studentName, classId]);
                    if (students.length > 0) {
                        const studentId = students[0].id;
                        await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [studentId, classId]);
                    }
                } catch (dbErr) {
                    console.error("[SCAN_SYNC_FAILURE]:", dbErr);
                }
            }
        });

        scannerProc.stderr.on('data', (data) => console.error(`[PYTHON_SCANNER_ERROR_${classId}]: ${data}`));
        scannerProc.on('close', (code) => activeScanners.delete(classId));

        res.json({ message: `Scanner initialized for Cluster ${classId}.` });
    } catch (err) {
        console.error("EXTERNAL_SCANNER_START_ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.stopExternalScanner = async (req, res) => {
    try {
        const { classId } = req.body;
        const proc = activeScanners.get(classId);
        if (proc) {
            if (process.platform === 'win32') {
                require('child_process').exec(`taskkill /pid ${proc.pid} /f /t`);
            } else {
                proc.kill('SIGTERM');
            }
            activeScanners.delete(classId);
            return res.json({ message: `Scanner for Cluster ${classId} stopped.` });
        }
        res.json({ message: `Scanner for Cluster ${classId} is already inactive.` });
    } catch (err) {
        console.error("EXTERNAL_SCANNER_STOP_ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.submitReport = async (req, res) => {
    try {
        const { report_code, class_id, date, subject, salle, salleId, heure, stagiaires, signature } = req.body;
        const formateur_id = req.user.id;

        const [reportRes] = await pool.query(
            'INSERT INTO reports (report_code, formateur_id, class_id, date, subject, salle, salleId, heure, signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [report_code, formateur_id, class_id, date, subject, salle, salleId || null, heure, signature]
        );

        const reportId = reportRes.insertId;

        if (stagiaires && stagiaires.length > 0) {
            const values = stagiaires.map(s => [reportId, s.id, s.status, s.Justifier || false]);
            await pool.query('INSERT INTO report_attendance (report_id, student_id, status, Justifier) VALUES ?', [values]);

            // Update Active Status: True if PRESENT OR (ABSENT AND JUSTIFIED)
            for (const s of stagiaires) {
                const isActive = (s.status === 'PRESENT' || (s.status === 'ABSENT' && s.Justifier)) ? 1 : 0;
                await pool.query('UPDATE stagiaires SET Active = ? WHERE NumInscription = ?', [isActive, s.id]);
            }
        }

        // Notify Admins
        const [admins] = await pool.query('SELECT id FROM admins');
        for (const admin of admins) {
            await pool.query(
                'INSERT INTO notifications (admin_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                [admin.id, 'message', 'RAPPORT', `Nouveau rapport : ${class_id}`, `Le formateur ${req.user.name} a soumis le rapport.`]
            );
        }

        res.status(201).json({ message: 'Report submitted successfully', reportId });
    } catch (err) {
        console.error("SUBMIT REPORT ERROR:", err);
        res.status(500).json({ message: 'Server error submitting report' });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const formateur_id = req.user.id;

        const [classes] = await pool.query(`
            SELECT c.* FROM classes c
            JOIN class_supervisors cs ON c.id = cs.class_id
            WHERE cs.formateur_id = ?
        `, [formateur_id]);

        const [schedule] = await pool.query(`
            SELECT t.id, t.day, t.time, t.class_id as class, f.name as formateur, t.subject, t.room 
            FROM timetable t 
            LEFT JOIN formateurs f ON t.formateur_id = f.id
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

        if (req.user.role !== 'admin') {
            const [supervisors] = await pool.query('SELECT * FROM class_supervisors WHERE class_id = ? AND formateur_id = ?', [classId, formateur_id]);
            if (supervisors.length === 0) return res.status(403).json({ message: 'Access Denied' });
        }

        const [users] = await pool.query('SELECT NumInscription as id, name, class_id FROM stagiaires WHERE class_id = ? AND Active = TRUE', [classId]);
        res.json({ users: users.map(u => ({ ...u, status: 'ACTIVE', lastLogin: 'Connected' })) });
    } catch (err) {
        console.error("GET FORMATEUR USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

exports.processCheckin = async (req, res) => {
    try {
        const { studentId, classId } = req.body;
        const [students] = await pool.query('SELECT id, name FROM stagiaires WHERE id = ? AND class_id = ?', [studentId, classId]);
        if (students.length === 0) return res.status(404).json({ message: 'Not found' });
        await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [studentId, classId]);
        res.json({ message: `Synchronized ${students[0].name}`, name: students[0].name });
    } catch (err) {
        console.error("CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

exports.processCheckinByQR = async (req, res) => {
    try {
        const { qrContent, classId } = req.body;
        const parts = qrContent.split('|');
        const name = parts.find(p => p.startsWith('NAME:'))?.split(':')[1];
        const group = parts.find(p => p.startsWith('GROUP:'))?.split(':')[1];
        
        if (group !== classId) return res.status(403).json({ message: 'Cluster mismatch' });
        
        const [students] = await pool.query('SELECT NumInscription as id FROM stagiaires WHERE name = ? AND class_id = ?', [name, group]);
        if (students.length === 0) return res.status(404).json({ message: 'Not found' });
        
        await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [students[0].id, classId]);
        res.json({ message: 'Success', name });
    } catch (err) {
        console.error("QR CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

exports.getActiveCheckins = async (req, res) => {
    try {
        const { classId } = req.params;
        const [checkins] = await pool.query('SELECT student_id FROM active_checkins WHERE class_id = ?', [classId]);
        res.json({ checkins: checkins.map(c => c.student_id) });
    } catch (err) {
        console.error("GET CHECKINS ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

exports.clearCheckins = async (req, res) => {
    try {
        const { classId } = req.body;
        await pool.query('DELETE FROM active_checkins WHERE class_id = ?', [classId]);
        res.json({ message: 'Cleared' });
    } catch (err) {
        console.error("CLEAR CHECKINS ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

exports.updateCheckinStatus = async (req, res) => {
    try {
        const { studentId, classId, status } = req.body;
        if (status === 'PRESENT') {
            await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [studentId, classId]);
        } else {
            await pool.query('DELETE FROM active_checkins WHERE student_id = ? AND class_id = ?', [studentId, classId]);
        }
        res.json({ message: 'Updated' });
    } catch (err) {
        console.error("UPDATE CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const [profiles] = await pool.query('SELECT id, name, email FROM formateurs WHERE id = ?', [req.user.id]);
        if (profiles.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ profile: { ...profiles[0], role: 'formateur' } });
    } catch (err) {
        console.error("GET PROFILE ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Feature disabled: image column removed
        res.json({ message: 'Profile update feature is currently limited (image removed)' });
    } catch (err) {
        console.error("UPDATE PROFILE ERROR:", err);
        res.status(500).json({ message: 'Error' });
    }
};

