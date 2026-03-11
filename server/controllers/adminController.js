const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

exports.getFormateurs = async (req, res) => {
    try {
        const [formateurs] = await pool.query('SELECT id, name, email, role FROM users WHERE role = ?', ['formateur']);
        res.json({ formateurs });
    } catch (err) {
        console.error("GET FORMATEURS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting formateurs' });
    }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const [[{ total_students }]] = await pool.query("SELECT COUNT(*) as total_students FROM users WHERE role = 'stagiaire'");
        const [[{ total_formateurs }]] = await pool.query("SELECT COUNT(*) as total_formateurs FROM users WHERE role = 'formateur'");
        const [[{ total_classes }]] = await pool.query("SELECT COUNT(*) as total_classes FROM classes");
        const [[{ total_reports }]] = await pool.query("SELECT COUNT(*) as total_reports FROM reports");

        res.json({
            summary: {
                total_students,
                total_formateurs,
                total_classes,
                total_reports
            }
        });
    } catch (err) {
        console.error("GET DASHBOARD SUMMARY ERROR:", err);
        res.status(500).json({ message: 'Server Error getting summary' });
    }
};

exports.getClassesAndSchedule = async (req, res) => {
    try {
        let classes = [];
        let schedule = [];
        try {
            [classes] = await pool.query(`
                SELECT 
                    c.*, 
                    (SELECT COUNT(*) FROM users u WHERE u.class_id = c.id AND u.role = 'stagiaire') as student_count,
                    GROUP_CONCAT(u_lead.name SEPARATOR ', ') as lead_formateurs
                FROM classes c
                LEFT JOIN class_supervisors cs ON c.id = cs.class_id
                LEFT JOIN users u_lead ON cs.formateur_id = u_lead.id
                GROUP BY c.id
            `);
            [schedule] = await pool.query(`
                SELECT t.id, t.day, t.time, t.class_id as class, u.name as formateur, t.subject, t.room 
                FROM timetable t
                LEFT JOIN users u ON t.formateur_id = u.id
            `);
        } catch (dbErr) {
            console.error("DB Error. Tables might not exist:", dbErr.message);
        }

        res.json({
            classes: classes.map(c => ({
                id: c.id,
                title: c.title,
                stream: c.stream,
                lead: c.lead_formateurs || '',
                students: c.student_count
            })),
            schedule: schedule
        });
    } catch (err) {
        console.error("GET SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Error fetching schedule: ' + err.message, stack: err.stack });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { id, title, stream, lead } = req.body;

        if (!id || !title || !stream || !lead) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await pool.query(
            'INSERT INTO classes (id, title, stream) VALUES (?, ?, ?)',
            [id, title, stream]
        );

        // Sync supervisors
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[user]] = await pool.query('SELECT id FROM users WHERE name = ? AND role = "formateur"', [leadName]);
            if (user) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [id, user.id]);
                await pool.query(
                    'INSERT INTO notifications (user_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                    [user.id, 'message', 'PLANNING', 'Nouveau Groupe Assigné', `Vous avez été assigné comme superviseur pour le groupe ${id}.`]
                );
            }
        }

        res.status(201).json({
            message: 'Class created successfully',
            class: { id, title, stream, lead: leads.join(', '), students: 0 }
        });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Class ID already exists.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, stream, lead } = req.body;

        if (!title || !stream || !lead) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await pool.query(
            'UPDATE classes SET title = ?, stream = ? WHERE id = ?',
            [title, stream, id]
        );

        // Sync supervisors
        await pool.query('DELETE FROM class_supervisors WHERE class_id = ?', [id]);
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[user]] = await pool.query('SELECT id FROM users WHERE name = ? AND role = "formateur"', [leadName]);
            if (user) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [id, user.id]);
            }
        }

        // Fetch updated object with count and leads
        const [[updatedClass]] = await pool.query(`
            SELECT 
                c.*, 
                (SELECT COUNT(*) FROM users u WHERE u.class_id = c.id AND u.role = 'stagiaire') as student_count,
                (SELECT GROUP_CONCAT(u_lead.name SEPARATOR ', ') FROM class_supervisors cs JOIN users u_lead ON cs.formateur_id = u_lead.id WHERE cs.class_id = c.id) as lead_formateurs
            FROM classes c WHERE c.id = ?
        `, [id]);

        res.json({
            message: 'Class updated successfully',
            class: {
                id: updatedClass.id,
                title: updatedClass.title,
                stream: updatedClass.stream,
                lead: updatedClass.lead_formateurs || '',
                students: updatedClass.student_count
            }
        });
    } catch (err) {
        console.error("UPDATE CLASS ERROR:", err);
        res.status(500).json({ message: 'Server Error updating class' });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Use a transaction or sequential deletes to handle constraints
        await pool.query('DELETE FROM timetable WHERE class_id = ?', [id]);
        await pool.query('DELETE FROM class_supervisors WHERE class_id = ?', [id]);
        await pool.query('UPDATE users SET class_id = NULL WHERE class_id = ?', [id]);

        const [result] = await pool.query('DELETE FROM classes WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Squadron not found in registry.' });
        }

        res.json({ message: 'Squadron purged from network.' });
    } catch (err) {
        console.error("DELETE CLASS ERROR:", err);
        res.status(500).json({ message: 'Neural Link Failure: Error during squadron deletion.' });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, room, formateur_id, time, day } = req.body;

        if (!subject || !room || !formateur_id) {
            return res.status(400).json({ message: 'Fields subject, room, and formateur_id are required.' });
        }

        const [currentSession] = await pool.query('SELECT class_id FROM timetable WHERE id = ?', [id]);
        if (currentSession.length === 0) {
            return res.status(404).json({ message: 'Séance non trouvée.' });
        }
        const class_id = currentSession[0].class_id;

        const parseTime = (timeStr) => {
            const [start, end] = timeStr.split('-').map(s => s.trim());
            const [h1, m1] = start.split(':').map(Number);
            const [h2, m2] = end.split(':').map(Number);
            return { start: h1 * 60 + m1, end: h2 * 60 + m2 };
        };

        const hasOverlap = (t1, t2) => {
            const o1 = parseTime(t1);
            const o2 = parseTime(t2);
            return Math.max(o1.start, o2.start) < Math.min(o1.end, o2.end);
        };

        const [existingSessions] = await pool.query('SELECT * FROM timetable WHERE day = ? AND id != ?', [day, id]);
        for (const session of existingSessions) {
            if (hasOverlap(time, session.time)) {
                if (session.class_id === class_id) {
                    return res.status(400).json({ message: 'Cette classe a déjà une séance à cette heure.' });
                }
                if (session.formateur_id === parseInt(formateur_id, 10)) {
                    return res.status(400).json({ message: 'Ce formateur a déjà une séance à cette heure.' });
                }
            }
        }

        await pool.query(
            'UPDATE timetable SET subject = ?, room = ?, formateur_id = ?, time = ?, day = ? WHERE id = ?',
            [subject, room, formateur_id, time, day, id]
        );

        res.json({ message: 'Timetable updated successfully' });
    } catch (err) {
        console.error("UPDATE SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Server Error updating schedule' });
    }
};

exports.createSchedule = async (req, res) => {
    try {
        const { class_id, formateur_id, subject, room, time, day } = req.body;

        if (!class_id || !formateur_id || !subject || !room || !time || !day) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const parseTime = (timeStr) => {
            const [start, end] = timeStr.split('-').map(s => s.trim());
            const [h1, m1] = start.split(':').map(Number);
            const [h2, m2] = end.split(':').map(Number);
            return { start: h1 * 60 + m1, end: h2 * 60 + m2 };
        };

        const hasOverlap = (t1, t2) => {
            const o1 = parseTime(t1);
            const o2 = parseTime(t2);
            return Math.max(o1.start, o2.start) < Math.min(o1.end, o2.end);
        };

        const [existingSessions] = await pool.query('SELECT * FROM timetable WHERE day = ?', [day]);
        for (const session of existingSessions) {
            if (hasOverlap(time, session.time)) {
                if (session.class_id === class_id) {
                    return res.status(400).json({ message: 'Cette classe a déjà une séance à cette heure.' });
                }
                if (session.formateur_id === parseInt(formateur_id, 10)) {
                    return res.status(400).json({ message: 'Ce formateur a déjà une séance à cette heure.' });
                }
            }
        }

        const [result] = await pool.query(
            'INSERT INTO timetable (class_id, formateur_id, subject, room, time, day) VALUES (?, ?, ?, ?, ?, ?)',
            [class_id, formateur_id, subject, room, time, day]
        );

        res.status(201).json({ message: 'Schedule entry created successfully', id: result.insertId });
    } catch (err) {
        console.error("CREATE SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Server Error creating schedule' });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if schedule exists
        const [result] = await pool.query('SELECT * FROM timetable WHERE id = ?', [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Seance not found' });
        }

        await pool.query('DELETE FROM timetable WHERE id = ?', [id]);
        res.json({ message: 'Seance supprimée avec succès' });
    } catch (error) {
        console.error("DELETE SCHEDULE ERROR:", error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
    }
};

exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        // Fetch Admin/Formateurs from users table assigned to this class
        const [users] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE class_id = ?', [classId]);

        // Fetch Stagiaires from the new stagiaires table
        const [stagiaires] = await pool.query('SELECT id, name, class_id, institute, year, profession, qr_path FROM stagiaires WHERE class_id = ?', [classId]);

        // Combine them for the UI
        const combined = [
            ...users.map(u => ({ ...u, status: 'ACTIVE', lastLogin: 'Staff' })),
            ...stagiaires.map(s => ({ ...s, role: 'stagiaire', status: 'ACTIVE', lastLogin: 'No Login' }))
        ];

        res.json({ users: combined });
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, role, class_id } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
            if (!class_id) return res.status(400).json({ message: 'Squadron ID is required for Stagiaires.' });

            // 1. Create Stagiaire in new table
            const [result] = await pool.query(
                'INSERT INTO stagiaires (name, class_id) VALUES (?, ?)',
                [name, class_id]
            );
            const stagiaireId = result.insertId;

            // 2. Generate QR Code via Python
            const qrData = {
                Name: name,
                Group: class_id,
                Institute: "OFPPT ISTA Mirleft",
                Year: "2025/2026",
                Profession: "stagiaire"
            };

            const pythonProcess = spawn('py', [
                path.join(__dirname, '../generate_qr.py'),
                JSON.stringify(qrData)
            ]);

            let newQrPath = '';
            pythonProcess.stdout.on('data', (data) => {
                const qrPathStr = data.toString().trim();
                newQrPath = '/uploads/card_id/' + path.basename(qrPathStr);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`[PY_STDERR]: ${data}`);
            });

            await new Promise((resolve) => {
                pythonProcess.on('close', resolve);
            });

            if (newQrPath) {
                await pool.query('UPDATE stagiaires SET qr_path = ? WHERE id = ?', [newQrPath, stagiaireId]);
            }

            const [[newStagiaire]] = await pool.query('SELECT * FROM stagiaires WHERE id = ?', [stagiaireId]);

            // Notify Formateurs of the class
            const [supervisors] = await pool.query('SELECT formateur_id FROM class_supervisors WHERE class_id = ?', [class_id]);
            for (const supervisor of supervisors) {
                await pool.query(
                    'INSERT INTO notifications (user_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                    [
                        supervisor.formateur_id,
                        'message',
                        'STAGIAIRE',
                        'Nouveau Stagiaire',
                        `Le stagiaire ${name} a été ajouté au groupe ${class_id}.`
                    ]
                );
            }

            return res.status(201).json({
                message: 'Stagiaire identity created. QR generated.',
                user: { ...newStagiaire, role: 'stagiaire', status: 'ACTIVE', lastLogin: 'No Login' }
            });

        } else {
            // Staff creation (Admin/Formateur)
            const email = name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt.ma';
            const defaultPassword = email.split('@')[0];
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash(defaultPassword, 10);

            let main_class_id = null;
            if (role === 'formateur' && class_id) {
                main_class_id = class_id.split(',')[0].trim();
            }

            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, role, class_id) VALUES (?, ?, ?, ?, ?)',
                [name, email, hash, role, main_class_id]
            );

            const userId = result.insertId;

            if (role === 'formateur' && class_id) {
                const classIds = class_id.split(',').map(id => id.trim());
                for (const cid of classIds) {
                    if (cid) {
                        await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [cid, userId]);
                    }
                }
            }

            const [[newUser]] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE id = ?', [userId]);
            res.status(201).json({
                message: 'Staff identity successfully initialized.',
                user: { ...newUser, status: 'ACTIVE', lastLogin: 'Staff' }
            });
        }
    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Identity Token already exists in registry.' });
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, class_id } = req.body;

        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
            // 1. Get old QR path to delete it
            const [[oldRecord]] = await pool.query('SELECT qr_path, institute, year, profession FROM stagiaires WHERE id = ?', [id]);

            if (oldRecord && oldRecord.qr_path) {
                const absoluteOldPath = path.join(__dirname, '..', oldRecord.qr_path);
                if (fs.existsSync(absoluteOldPath)) {
                    fs.unlinkSync(absoluteOldPath);
                }
            }

            // 2. Update basic info
            await pool.query(
                'UPDATE stagiaires SET name = ?, class_id = ? WHERE id = ?',
                [name, class_id, id]
            );

            // 3. Generate New QR Code
            const qrData = {
                Name: name,
                Group: class_id,
                Institute: oldRecord ? oldRecord.institute : "OFPPT ISTA Mirleft",
                Year: oldRecord ? oldRecord.year : "2025/2026",
                Profession: oldRecord ? oldRecord.profession : "stagiaire"
            };

            const pythonProcess = spawn('py', [
                path.join(__dirname, '../generate_qr.py'),
                JSON.stringify(qrData)
            ]);

            let newQrPath = '';
            pythonProcess.stdout.on('data', (data) => {
                const qrPathStr = data.toString().trim();
                newQrPath = '/uploads/card_id/' + path.basename(qrPathStr);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`[PY_STDERR]: ${data}`);
            });

            await new Promise((resolve) => {
                pythonProcess.on('close', resolve);
            });

            if (newQrPath) {
                await pool.query('UPDATE stagiaires SET qr_path = ? WHERE id = ?', [newQrPath, id]);
            }

            const [[updated]] = await pool.query('SELECT * FROM stagiaires WHERE id = ?', [id]);
            res.json({ message: 'Stagiaire updated. New QR generated.', user: { ...updated, role: 'stagiaire' } });
        } else {
            const email = name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt.ma';
            let main_class_id = null;
            if (role === 'formateur' && class_id) {
                main_class_id = class_id.split(',')[0].trim();
            }

            await pool.query(
                'UPDATE users SET name = ?, email = ?, role = ?, class_id = ? WHERE id = ?',
                [name, email, role, main_class_id, id]
            );

            if (role === 'formateur' && class_id) {
                await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);
                const classIds = class_id.split(',').map(cid => cid.trim());
                for (const cid of classIds) {
                    if (cid) {
                        await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [cid, id]);
                    }
                }
            }
            const [[updated]] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE id = ?', [id]);
            res.json({ message: 'Staff identity updated.', user: updated });
        }
    } catch (err) {
        console.error("UPDATE USER ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        if (role === 'stagiaire') {
            const [[user]] = await pool.query('SELECT qr_path FROM stagiaires WHERE id = ?', [id]);
            if (user && user.qr_path) {
                const absolutePath = path.join(__dirname, '..', user.qr_path);
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            }
            await pool.query('DELETE FROM stagiaires WHERE id = ?', [id]);
        } else {
            await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);
            await pool.query('DELETE FROM users WHERE id = ?', [id]);
        }

        res.json({ message: 'Identity purged from network.' });
    } catch (err) {
        console.error("DELETE USER ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        const [reports] = await pool.query(`
            SELECT r.*, c.title as class_title, u.name as formateur_name
            FROM reports r
            JOIN classes c ON r.class_id = c.id
            JOIN users u ON r.formateur_id = u.id
            ORDER BY r.date DESC, r.created_at DESC
        `);

        // Fetch students for each report (now joining with stagiaires table)
        const reportsWithStagiaires = await Promise.all(reports.map(async (report) => {
            const [stagiaires] = await pool.query(`
                SELECT ra.student_id as id, s.name as name, ra.status 
                FROM report_attendance ra
                JOIN stagiaires s ON ra.student_id = s.id
                WHERE ra.report_id = ?
            `, [report.id]);
            return {
                ...report,
                stagiaires: stagiaires.map(s => ({
                    id: s.id,
                    name: s.name,
                    status: s.status
                }))
            };
        }));

        res.json({ reports: reportsWithStagiaires });
    } catch (err) {
        console.error("GET REPORTS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting reports' });
    }
};
