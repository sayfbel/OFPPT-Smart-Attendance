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
        // Spawn Python process with both cluster id and camera index
        const scannerProc = spawn('py', [scriptPath, classId, camIdx]);

        activeScanners.set(classId, scannerProc);

        scannerProc.stdout.on('data', async (data) => {
            const rawOutput = data.toString();
            console.log(`[PYTHON_SCANNER_${classId}]: ${rawOutput}`);

            // Neural Link: Parse scan notification marker
            // Match format: NAME: {name} : present
            const match = rawOutput.match(/NAME:\s+(.*?)\s+:\s+present/);
            if (match) {
                const studentName = match[1].trim();
                console.log(`[BRIDGE_LOCK]: Synchronizing ${studentName} for Cluster ${classId}...`);

                try {
                    // Look up student by name in the specified class
                    const [students] = await pool.query('SELECT NumInscription as id FROM stagiaires WHERE name = ? AND class_id = ?', [studentName, classId]);
                    if (students.length > 0) {
                        const studentId = students[0].id;
                        await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [studentId, classId]);
                        console.log(`[SYNC_COMPLETE]: ${studentName} registered.`);
                    }
                } catch (dbErr) {
                    console.error("[SCAN_SYNC_FAILURE]:", dbErr);
                }
            }
        });

        scannerProc.stderr.on('data', (data) => {
            console.error(`[PYTHON_SCANNER_ERROR_${classId}]: ${data}`);
        });

        scannerProc.on('close', (code) => {
            console.log(`[SCANNER_DISCONNECTED]: Process for ${classId} exited with code ${code}.`);
            activeScanners.delete(classId);
        });

        res.json({ message: `Neural Bridge established for Cluster ${classId}. Scanner initialized.` });

    } catch (err) {
        console.error("EXTERNAL_SCANNER_START_ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Bridge initialization failed.' });
    }
};

exports.stopExternalScanner = async (req, res) => {
    try {
        const { classId } = req.body;
        console.log(`[BRIDGE_CONTROL]: Shutdown request for Cluster ${classId}`);

        const proc = activeScanners.get(classId);

        if (proc) {
            console.log(`[BRIDGE_CONTROL]: Terminating process tree for Cluster ${classId}...`);

            if (process.platform === 'win32') {
                // Forcefully kill the process tree on Windows to ensure CV2 window closes
                const { exec } = require('child_process');
                exec(`taskkill /pid ${proc.pid} /f /t`, (err) => {
                    if (err) console.error(`[BRIDGE_CONTROL]: Taskkill failed for ${proc.pid}:`, err);
                });
            } else {
                proc.kill('SIGTERM');
            }

            activeScanners.delete(classId);
            console.log(`[BRIDGE_CONTROL]: Synchronized shutdown complete for Cluster ${classId}`);
            return res.json({ message: `Neural Bridge for Cluster ${classId} disconnected.` });
        }

        // Return 200 even if not found to avoid noisy AxiosErrors in frontend cleanup
        console.log(`[BRIDGE_CONTROL]: No active process found for ${classId}. Status: Idle.`);
        res.json({ message: `Neural Bridge for Cluster ${classId} is already inactive.` });
    } catch (err) {
        console.error("EXTERNAL_SCANNER_STOP_ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Bridge disconnect failed.' });
    }
};

exports.submitReport = async (req, res) => {
    try {
        const { report_code, class_id, date, subject, salle, heure, stagiaires, signature } = req.body;
        const formateur_id = req.user.id;

        if (!report_code || !class_id || !date || !subject) {
            return res.status(400).json({ message: 'Required fields missing: report_code, class_id, date, subject' });
        }

        // 1. Create the report record
        const [reportRes] = await pool.query(
            'INSERT INTO reports (report_code, formateur_id, class_id, date, subject, salle, heure, signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [report_code, formateur_id, class_id, date, subject, salle, heure, signature]
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
                    `Nouveau rapport : ${class_id}`,
                    `Le formateur ${req.user.name} a soumis le rapport de présence pour le module ${subject}.`
                ]
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

        res.json({ classes, schedule: [] });
    } catch (err) {
        console.error("GET FORMATEUR CLASSES ERROR:", err);
        res.status(500).json({ message: 'Server error fetching classes' });
    }
};

exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const formateur_id = req.user.id;

        // Verify access: Admin can access all, Formateurs must be supervisors
        if (req.user.role !== 'admin') {
            const [supervisors] = await pool.query(
                'SELECT * FROM class_supervisors WHERE class_id = ? AND formateur_id = ?',
                [classId, formateur_id]
            );

            if (supervisors.length === 0) {
                return res.status(403).json({ message: 'Access Denied: You are not a supervisor for this squadron.' });
            }
        }

        const [users] = await pool.query(
            'SELECT NumInscription as id, name, class_id FROM stagiaires WHERE class_id = ?',
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
        const [students] = await pool.query('SELECT NumInscription as id, name FROM stagiaires WHERE NumInscription = ? AND class_id = ?', [studentId, classId]);
        const student = students[0];
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

// Neural Portal: Process Check-in by QR Content
exports.processCheckinByQR = async (req, res) => {
    try {
        const { qrContent, classId } = req.body;

        if (!qrContent) return res.status(400).json({ message: 'No QR signal received.' });

        // Parse format: NAME:xxx|GROUP:yyy|...
        const parts = qrContent.split('|');
        const namePart = parts.find(p => p.startsWith('NAME:'));
        const groupPart = parts.find(p => p.startsWith('GROUP:'));

        if (!namePart || !groupPart) {
            return res.status(400).json({ message: 'Invalid signal format. Cluster mismatch.' });
        }

        const name = namePart.split(':')[1];
        const group = groupPart.split(':')[1];

        if (group !== classId) {
            return res.status(403).json({ message: `Access Denied: Node ${name} belongs to Cluster ${group}.` });
        }

        // Look up student id from name and group
        const [students] = await pool.query('SELECT NumInscription as id FROM stagiaires WHERE name = ? AND class_id = ?', [name, group]);
        if (students.length === 0) {
            return res.status(404).json({ message: 'Entity not found in the manifest.' });
        }

        const studentId = students[0].id;

        // Register in active_checkins
        await pool.query('INSERT IGNORE INTO active_checkins (student_id, class_id) VALUES (?, ?)', [studentId, classId]);

        res.json({ message: 'Signal Captured: Syncing node...', name });
    } catch (err) {
        console.error("QR CHECKIN ERROR:", err);
        res.status(500).json({ message: 'Neural link interrupted.' });
    }
};

// Neural Portal: Get Active Check-ins for a class
exports.getActiveCheckins = async (req, res) => {
    try {
        const { classId } = req.params;
        const [checkins] = await pool.query(`
            SELECT ra.student_id, ra.status, 1 as priority
            FROM report_attendance ra 
            JOIN reports r ON ra.report_id = r.id 
            WHERE r.class_id = ? AND r.date = CURDATE()
            UNION
            SELECT student_id, status, 2 as priority 
            FROM active_checkins 
            WHERE class_id = ?
            ORDER BY priority ASC
        `, [classId, classId]);
        res.json({ checkins: checkins.map(c => ({ student_id: c.student_id, status: c.status })) });
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

// Neural Portal: Manual Status Override
exports.updateCheckinStatus = async (req, res) => {
    try {
        const { studentId, classId, status } = req.body;

            await pool.query('DELETE FROM active_checkins WHERE student_id = ? AND class_id = ?', [studentId, classId]);
            await pool.query(
                'INSERT INTO active_checkins (student_id, class_id, status) VALUES (?, ?, ?)',
                [studentId, classId, status]
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
