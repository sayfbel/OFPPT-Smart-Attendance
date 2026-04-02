const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

exports.getFormateurs = async (req, res) => {
    try {
        const [formateurs] = await pool.query("SELECT id, name, email, 'formateur' as role FROM formateurs");
        res.json({ formateurs });
    } catch (err) {
        console.error("GET FORMATEURS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting formateurs' });
    }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const [[{ total_students }]] = await pool.query("SELECT COUNT(*) as total_students FROM stagiaires");
        const [[{ total_formateurs }]] = await pool.query("SELECT COUNT(*) as total_formateurs FROM formateurs");
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
<<<<<<< HEAD
                    c.*, f.nom as filiere_name,
=======
                    c.*, f.nom as stream,
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                    (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count,
                    GROUP_CONCAT(u_lead.name SEPARATOR ', ') as lead_formateurs
                FROM classes c
                LEFT JOIN filiere f ON c.filiereId = f.id
                LEFT JOIN class_supervisors cs ON c.id = cs.class_id
                LEFT JOIN formateurs u_lead ON cs.formateur_id = u_lead.id
                GROUP BY c.id
            `);
<<<<<<< HEAD
=======
            [schedule] = await pool.query(`
                SELECT t.id, t.day, t.time, t.class_id as class, u.name as formateur, t.subject, t.room 
                FROM timetable t
                LEFT JOIN formateurs u ON t.formateur_id = u.id
            `);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        } catch (dbErr) {
            console.error("DB Error. Tables might not exist:", dbErr.message);
        }

        res.json({
            classes: classes.map(c => ({
                id: c.id,
<<<<<<< HEAD
                filiere: c.filiere_name || 'N/A',
                année_scolaire: c.annee_scolaire,
                filiereId: c.filiereId,
=======
                title: c.title,
                stream: c.stream,
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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

<<<<<<< HEAD
exports.createClass = async (req, res, next) => {
    try {
        const { id, filiereId, lead, année_scolaire, level } = req.body;
=======
exports.createClass = async (req, res) => {
    try {
        const { id, filiereId, optionId, lead, année_scolaire, level } = req.body;
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

        if (!id || !filiereId) {
            return res.status(400).json({ message: 'L\'ID du groupe et la filière sont obligatoires.' });
        }

        await pool.query(
<<<<<<< HEAD
            'INSERT INTO classes (id, filiereId, annee_scolaire) VALUES (?, ?, ?)',
            [id, filiereId, année_scolaire || '2025/2026']
=======
            'INSERT INTO classes (id, filiereId, optionId, annee_scolaire, level) VALUES (?, ?, ?, ?, ?)',
            [id, filiereId, optionId || null, année_scolaire || '2025/2026', level || '1er']
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        );

        // Sync supervisors
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[user]] = await pool.query('SELECT id FROM formateurs WHERE name = ?', [leadName]);
            if (user) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [id, user.id]);
                // Ensure notification only if admin users table exists or handle formateur notification safely
                try {
                    await pool.query(
                        'INSERT INTO notifications (user_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                        [user.id, 'message', 'PLANNING', 'Nouveau Groupe Assigné', `Vous avez été assigné comme superviseur pour le groupe ${id}.`]
                    );
                } catch(err) { }
            }
        }

        res.status(201).json({
            message: 'Class created successfully',
<<<<<<< HEAD
            class: { id, filiereId, annee_scolaire: année_scolaire, lead: leads.join(', '), students: 0 }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateClass = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { filiereId, lead, année_scolaire, level } = req.body;
=======
            class: { id, filiereId, optionId, annee_scolaire: année_scolaire, level, lead: leads.join(', '), students: 0 }
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
        const { filiereId, optionId, lead, année_scolaire, level } = req.body;
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

        if (!filiereId) {
            return res.status(400).json({ message: 'La filière est obligatoire.' });
        }

        await pool.query(
<<<<<<< HEAD
            'UPDATE classes SET filiereId = ?, annee_scolaire = ? WHERE id = ?',
            [filiereId, année_scolaire || '2025/2026', id]
=======
            'UPDATE classes SET filiereId = ?, optionId = ?, annee_scolaire = ?, level = ? WHERE id = ?',
            [filiereId, optionId || null, année_scolaire || '2025/2026', level || '1er', id]
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        );

        // Sync supervisors
        await pool.query('DELETE FROM class_supervisors WHERE class_id = ?', [id]);
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[user]] = await pool.query('SELECT id FROM formateurs WHERE name = ?', [leadName]);
            if (user) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [id, user.id]);
            }
        }

        // Fetch updated object with count and leads
        const [[updatedClass]] = await pool.query(`
            SELECT 
<<<<<<< HEAD
                c.*, f.nom as stream,
=======
                c.*, f.nom as stream, o.nom as optionText,
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count,
                (SELECT GROUP_CONCAT(u_lead.name SEPARATOR ', ') FROM class_supervisors cs JOIN formateurs u_lead ON cs.formateur_id = u_lead.id WHERE cs.class_id = c.id) as lead_formateurs
            FROM classes c 
            LEFT JOIN filiere f ON c.filiereId = f.id
<<<<<<< HEAD
=======
            LEFT JOIN options o ON c.optionId = o.id
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            WHERE c.id = ?
        `, [id]);

        res.json({
            message: 'Class updated successfully',
            class: {
                id: updatedClass.id,
<<<<<<< HEAD
                filiere: updatedClass.stream,
                filiereId: updatedClass.filiereId,
                année_scolaire: updatedClass.annee_scolaire,
=======
                stream: updatedClass.stream,
                option: updatedClass.optionText,
                filiereId: updatedClass.filiereId,
                optionId: updatedClass.optionId,
                annee_scolaire: updatedClass.annee_scolaire,
                level: updatedClass.level,
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
                lead: updatedClass.lead_formateurs || '',
                students: updatedClass.student_count
            }
        });
    } catch (err) {
<<<<<<< HEAD
        next(err);
=======
        console.error("UPDATE CLASS ERROR:", err);
        res.status(500).json({ message: 'Server Error updating class' });
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Use a transaction or sequential deletes to handle constraints
<<<<<<< HEAD
=======
        await pool.query('DELETE FROM timetable WHERE class_id = ?', [id]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        await pool.query('DELETE FROM class_supervisors WHERE class_id = ?', [id]);
        await pool.query('UPDATE stagiaires SET class_id = NULL WHERE class_id = ?', [id]);

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

<<<<<<< HEAD
=======
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
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const [supervisors] = await pool.query(`
            SELECT f.id, f.name, f.email, 'formateur' as role, c.class_id 
            FROM formateurs f 
            JOIN class_supervisors c ON f.id = c.formateur_id 
            WHERE c.class_id = ?
        `, [classId]);

<<<<<<< HEAD
        const [stagiaires] = await pool.query("SELECT NumInscription as id, name, class_id, 'stagiaire' as profession, qr_path, Active FROM stagiaires WHERE class_id = ?", [classId]);
=======
        const [stagiaires] = await pool.query("SELECT NumInscription as id, name, class_id, annee as year, 'stagiaire' as profession, qr_path, Active FROM stagiaires WHERE class_id = ?", [classId]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

        const combined = [
            ...supervisors.map(u => ({ ...u, status: 'ACTIVE', lastLogin: 'Staff' })),
            ...stagiaires.map(s => ({ ...s, role: 'stagiaire', status: s.Active ? 'ACTIVE' : 'INACTIVE', lastLogin: 'No Login' }))
        ];

        res.json({ users: combined });
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

<<<<<<< HEAD
exports.createUser = async (req, res, next) => {
    try {
        const { name, role, class_id, filiereId, annee, numInsc } = req.body;
=======
exports.createUser = async (req, res) => {
    try {
        const { name, role, class_id, filiereId, optionId, annee } = req.body;
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
<<<<<<< HEAD
            if (!numInsc) return res.status(400).json({ message: 'NumInscription est obligatoire pour les stagiaires.' });

            // 1. Create Stagiaire in new table
            await pool.query(
                'INSERT INTO stagiaires (NumInscription, name, class_id, filiereId) VALUES (?, ?, ?, ?)',
                [numInsc, name, class_id || null, filiereId || null]
=======
            const numInsc = 'STG' + Math.floor(Math.random() * 90000) + Date.now().toString().slice(-4);

            // 1. Create Stagiaire in new table
            await pool.query(
                'INSERT INTO stagiaires (NumInscription, name, class_id, filiereId, optionId, annee) VALUES (?, ?, ?, ?, ?, ?)',
                [numInsc, name, class_id || null, filiereId || null, optionId || null, annee || '1er']
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            );
            const stagiaireId = numInsc;

            // 2. Generate QR Code via Python
            const qrData = {
                Name: name,
                Group: class_id || "Unassigned",
                Institute: "OFPPT ISTA",
<<<<<<< HEAD
=======
                Year: annee || "1er",
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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
                await pool.query('UPDATE stagiaires SET qr_path = ? WHERE NumInscription = ?', [newQrPath, stagiaireId]);
            }

<<<<<<< HEAD
            const [[newStagiaire]] = await pool.query('SELECT NumInscription as id, name, class_id, filiereId, qr_path FROM stagiaires WHERE NumInscription = ?', [stagiaireId]);
=======
            const [[newStagiaire]] = await pool.query('SELECT NumInscription as id, name, class_id, annee, filiereId, optionId, qr_path FROM stagiaires WHERE NumInscription = ?', [stagiaireId]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

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

<<<<<<< HEAD
            const table = role === 'admin' ? 'admins' : 'formateurs';
            
            const [result] = await pool.query(
                `INSERT INTO ${table} (name, email, password${role === 'formateur' ? ', type' : ''}) VALUES (?, ?, ?${role === 'formateur' ? ", 'Parrain'" : ''})`,
                [name, email, hash]
=======
            let main_class_id = null;
            if (role === 'formateur' && class_id) {
                main_class_id = class_id.split(',')[0].trim();
            }

            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, role, class_id) VALUES (?, ?, ?, ?, ?)',
                [name, email, hash, role, main_class_id]
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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

<<<<<<< HEAD
            const [[newUser]] = await pool.query(`SELECT id, name, email, '${role}' as role FROM ${table} WHERE id = ?`, [userId]);
=======
            const [[newUser]] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE id = ?', [userId]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            res.status(201).json({
                message: 'Staff identity successfully initialized.',
                user: { ...newUser, status: 'ACTIVE', lastLogin: 'Staff' }
            });
        }
    } catch (err) {
<<<<<<< HEAD
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, class_id, filiereId, annee } = req.body;
=======
        console.error("CREATE USER ERROR:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Identity Token already exists in registry.' });
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, class_id, filiereId, optionId, annee } = req.body;
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
            // 1. Get old QR path to delete it
<<<<<<< HEAD
            const [[oldRecord]] = await pool.query('SELECT qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
=======
            const [[oldRecord]] = await pool.query('SELECT qr_path, annee FROM stagiaires WHERE NumInscription = ?', [id]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

            if (oldRecord && oldRecord.qr_path) {
                const absoluteOldPath = path.join(__dirname, '..', oldRecord.qr_path);
                if (fs.existsSync(absoluteOldPath)) {
                    fs.unlinkSync(absoluteOldPath);
                }
            }

            // 2. Update basic info
            await pool.query(
<<<<<<< HEAD
                'UPDATE stagiaires SET name = ?, class_id = ?, filiereId = ? WHERE NumInscription = ?',
                [name, class_id || null, filiereId || null, id]
=======
                'UPDATE stagiaires SET name = ?, class_id = ?, filiereId = ?, optionId = ?, annee = ? WHERE NumInscription = ?',
                [name, class_id || null, filiereId || null, optionId || null, annee || '1er', id]
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            );

            // 3. Generate New QR Code
            const qrData = {
                Name: name,
                Group: class_id || "Unassigned",
                Institute: "OFPPT ISTA",
<<<<<<< HEAD
=======
                Year: annee || (oldRecord ? oldRecord.annee : "1er"),
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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
                await pool.query('UPDATE stagiaires SET qr_path = ? WHERE NumInscription = ?', [newQrPath, id]);
            }

<<<<<<< HEAD
            const [[updated]] = await pool.query('SELECT NumInscription as id, name, class_id, filiereId, qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
=======
            const [[updated]] = await pool.query('SELECT NumInscription as id, name, class_id, annee, filiereId, optionId, qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            res.json({ message: 'Stagiaire updated. New QR generated.', user: { ...updated, role: 'stagiaire' } });
        } else {
            const email = name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt.ma';
            const defaultPassword = email.split('@')[0];
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash(defaultPassword, 10);

<<<<<<< HEAD
            const table = role === 'admin' ? 'admins' : 'formateurs';

            await pool.query(
                `UPDATE ${table} SET name = ?, email = ?, password = ? WHERE id = ?`,
                [name, email, hash, id]
=======
            let main_class_id = null;
            if (role === 'formateur' && class_id) {
                main_class_id = class_id.split(',')[0].trim();
            }

            await pool.query(
                'UPDATE users SET name = ?, email = ?, password = ?, role = ?, class_id = ? WHERE id = ?',
                [name, email, hash, role, main_class_id, id]
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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
<<<<<<< HEAD
            const [[updated]] = await pool.query(`SELECT id, name, email, '${role}' as role FROM ${table} WHERE id = ?`, [id]);
            res.json({ message: 'Staff identity updated.', user: updated });
        }
    } catch (err) {
        next(err);
=======
            const [[updated]] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE id = ?', [id]);
            res.json({ message: 'Staff identity updated.', user: updated });
        }
    } catch (err) {
        console.error("UPDATE USER ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error' });
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        if (role === 'stagiaire') {
<<<<<<< HEAD
            const [[user]] = await pool.query('SELECT qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
=======
            const [[user]] = await pool.query('SELECT qr_path FROM stagiaires WHERE id = ?', [id]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            if (user && user.qr_path) {
                const absolutePath = path.join(__dirname, '..', user.qr_path);
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            }
<<<<<<< HEAD
            await pool.query('DELETE FROM stagiaires WHERE NumInscription = ?', [id]);
        } else {
            await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);
            const table = role === 'admin' ? 'admins' : 'formateurs';
            await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
=======
            await pool.query('DELETE FROM stagiaires WHERE id = ?', [id]);
        } else {
            await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);
            await pool.query('DELETE FROM users WHERE id = ?', [id]);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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
<<<<<<< HEAD
            SELECT r.*, c.id as class_id, u.name as formateur_name
            FROM reports r
            JOIN classes c ON r.class_id = c.id
            JOIN formateurs u ON r.formateur_id = u.id
=======
            SELECT r.*, c.title as class_title, u.name as formateur_name
            FROM reports r
            JOIN classes c ON r.class_id = c.id
            JOIN users u ON r.formateur_id = u.id
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
            ORDER BY r.date DESC, r.created_at DESC
        `);

        // Fetch students for each report (now joining with stagiaires table)
        const reportsWithStagiaires = await Promise.all(reports.map(async (report) => {
            const [stagiaires] = await pool.query(`
                SELECT ra.student_id as id, s.name as name, ra.status 
                FROM report_attendance ra
<<<<<<< HEAD
                JOIN stagiaires s ON ra.student_id = s.NumInscription
=======
                JOIN stagiaires s ON ra.student_id = s.id
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
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

exports.getUsers = async (req, res) => {
    try {
<<<<<<< HEAD
        // Only fetch formateurs and stagiaires
        const [formateurs] = await pool.query(`
            SELECT f.id, f.name, f.email, 'formateur' as role, f.type,
                   GROUP_CONCAT(cs.class_id SEPARATOR ', ') as supervised_classes,
                   f.last_seen
            FROM formateurs f
            LEFT JOIN class_supervisors cs ON f.id = cs.formateur_id
            GROUP BY f.id
        `);
        
        // Include absence, late, filiere and class info for stagiaires
        const [stagiaires] = await pool.query(`
            SELECT 
                s.NumInscription as id, s.name, s.class_id, 
                s.qr_path, s.Active,
                f.nom as filiere_name,
                c.annee_scolaire,
                (SELECT COUNT(*) FROM report_attendance ra WHERE ra.student_id = s.NumInscription AND ra.status = 'ABSENT') as absence_count,
                (SELECT COUNT(*) FROM report_attendance ra WHERE ra.student_id = s.NumInscription AND ra.status = 'LATE') as late_count
            FROM stagiaires s
            LEFT JOIN filiere f ON s.filiereId = f.id
            LEFT JOIN classes c ON s.class_id = c.id
        `);
        
        const combined = [
            ...formateurs.map(f => ({ 
                ...f, 
                classes: f.supervised_classes || '', 
                is_online: f.last_seen && (Date.now() - new Date(f.last_seen).getTime() < 300000), // 5 min
                status: 'ACTIVE', 
                lastLogin: 'Staff' 
            })),
            ...stagiaires.map(s => ({ 
                ...s, 
                email: s.name.replace(/\s/g, '').toLowerCase() + '@ofppt.ma', 
                role: 'stagiaire', 
                filiere: s.filiere_name,
                class_id: s.class_id,
                annee_scolaire: s.annee_scolaire,
                status: s.Active ? 'ACTIVE' : 'INACTIVE', 
                lastLogin: 'No Login',
                absences: s.absence_count,
                lates: s.late_count
            }))
=======
        const [admins] = await pool.query("SELECT id, name, email, 'admin' as role, NULL as class_id FROM admins");
        const [formateurs] = await pool.query("SELECT id, name, email, 'formateur' as role, type FROM formateurs");
        const [stagiaires] = await pool.query("SELECT NumInscription as id, name, class_id, annee as year, 'stagiaire' as profession, qr_path, Active FROM stagiaires");
        
        const combined = [
            ...admins.map(a => ({ ...a, status: 'ACTIVE', lastLogin: 'Staff' })),
            ...formateurs.map(f => ({ ...f, status: 'ACTIVE', lastLogin: 'Staff' })),
            ...stagiaires.map(s => ({ ...s, email: s.name.replace(/\s/g, '').toLowerCase() + '@ofppt.ma', role: 'stagiaire', status: s.Active ? 'ACTIVE' : 'INACTIVE', lastLogin: 'No Login' }))
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
        ];

        res.json({ users: combined });
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

<<<<<<< HEAD
exports.getAbsenceRegistry = async (req, res) => {
    try {
        const [registry] = await pool.query(`
            SELECT 
                ra.id as record_id,
                ra.status,
                ra.Justifier as justified,
                s.NumInscription as student_id,
                s.name as student_name,
                s.class_id,
                r.date as session_date,
                r.subject,
                r.heure as session_time,
                f.name as formateur_name
            FROM report_attendance ra
            JOIN stagiaires s ON ra.student_id = s.NumInscription
            JOIN reports r ON ra.report_id = r.id
            JOIN formateurs f ON r.formateur_id = f.id
            WHERE ra.status != 'PRESENT'
            ORDER BY r.date DESC, r.created_at DESC, ra.id DESC
        `);
        res.json({ registry });
    } catch (err) {
        console.error("GET ABSENCE REGISTRY ERROR:", err);
        res.status(500).json({ message: 'Server Error fetching registry' });
    }
};

exports.justifyAbsence = async (req, res) => {
    try {
        const { recordId, justified } = req.body;
        // If justified, we could either mark it or delete it. 
        // The user said "change the statue of abcent to abcent justifie = present or can give hem blam or make hem present"
        // If it's justified, it's basically 'PRESENT' (which we don't store). So we can delete the record.
        if (justified) {
            await pool.query('DELETE FROM report_attendance WHERE id = ?', [recordId]);
        }
        res.json({ message: 'Absence status updated.' });
    } catch (err) {
        console.error("JUSTIFY ABSENCE ERROR:", err);
        res.status(500).json({ message: 'Server Error updating absence' });
    }
};

exports.addDisciplinePenalty = async (req, res) => {
    try {
        const { stagiaireId, penalty, reason } = req.body;
        
        await pool.query(
            'INSERT INTO suivieDisipline (student_id, penalty_type, date, reason) VALUES (?, ?, CURDATE(), ?)',
            [stagiaireId, penalty, reason]
        );

        res.json({ message: 'Penalty assigned successfully.' });
    } catch (err) {
        console.error("ADD PENALTY ERROR:", err);
        res.status(500).json({ message: 'Server Error assigning penalty' });
    }
};

exports.getDisciplineHistory = async (req, res) => {
    try {
        const { stagiaireId } = req.params;
        const [history] = await pool.query(`
            SELECT d.*
            FROM suivieDisipline d
            WHERE d.student_id = ?
            ORDER BY d.date DESC
        `, [stagiaireId]);
        res.json({ history });
    } catch (err) {
        console.error("GET DISCIPLINE HISTORY ERROR:", err);
        res.status(500).json({ message: 'Server Error fetching history' });
    }
};

exports.getClasses = async (req, res) => {
    try {
        const [classes] = await pool.query(`
            SELECT c.*, f.nom as filiere_name,
                (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count
            FROM classes c
            LEFT JOIN filiere f ON c.filiereId = f.id
        `);
        res.json({ classes: classes.map(c => ({
            ...c, 
            students: c.student_count, 
            filiere: c.filiere_name, 
            année_scolaire: c.annee_scolaire
        })) });
=======
exports.getClasses = async (req, res) => {
    try {
        const [classes] = await pool.query(`
            SELECT c.*, f.nom as stream, o.nom as optionText,
                (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count
            FROM classes c
            LEFT JOIN filiere f ON c.filiereId = f.id
            LEFT JOIN options o ON c.optionId = o.id
        `);
        res.json({ classes: classes.map(c => ({...c, students: c.student_count, option: c.optionText})) });
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    } catch (err) {
        console.error("GET CLASSES ERROR:", err);
        res.status(500).json({ message: 'Server Error getting classes' });
    }
};

<<<<<<< HEAD
=======
exports.getTimetable = async (req, res) => {
    try {
        const [schedule] = await pool.query(`
            SELECT t.id, t.day, t.time, t.class_id as class, u.name as formateur, t.subject, t.room 
            FROM timetable t
            LEFT JOIN formateurs u ON t.formateur_id = u.id
        `);
        res.json({ schedule: schedule });
    } catch (err) {
        console.error("GET TIMETABLE ERROR:", err);
        res.status(500).json({ message: 'Server Error getting timetable' });
    }
};
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

exports.getFilieres = async (req, res) => {
    try {
        const [filieres] = await pool.query('SELECT * FROM filiere');
        res.json({ filieres });
    } catch (err) {
        res.status(500).json({ message: 'Server Error getting filieres' });
    }
};

<<<<<<< HEAD

exports.createFiliere = async (req, res, next) => {
=======
exports.getOptions = async (req, res) => {
    try {
        const [options] = await pool.query('SELECT * FROM options');
        res.json({ options });
    } catch (err) {
        res.status(500).json({ message: 'Server Error getting options' });
    }
};

exports.createFiliere = async (req, res) => {
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    try {
        const { nom, niveau } = req.body;
        const [result] = await pool.query('INSERT INTO filiere (nom, niveau) VALUES (?, ?)', [nom, niveau || 'TS']);
        res.json({ id: result.insertId, nom, niveau });
    } catch (err) {
<<<<<<< HEAD
        next(err);
=======
        console.error(err);
        res.status(500).json({ message: 'Server Error creating filiere' });
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
    }
};

exports.deleteFiliere = async (req, res) => {
    try {
        await pool.query('DELETE FROM filiere WHERE id = ?', [req.params.id]);
        res.json({ message: 'Filiere deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error deleting filiere' });
    }
};

<<<<<<< HEAD
=======
exports.createOption = async (req, res) => {
    try {
        const { filiereId, nom, niveau } = req.body;
        const [result] = await pool.query('INSERT INTO options (filiereId, nom, niveau) VALUES (?, ?, ?)', [filiereId, nom, niveau || 'TS']);
        res.json({ id: result.insertId, filiereId, nom, niveau });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error creating option' });
    }
};

exports.deleteOption = async (req, res) => {
    try {
        await pool.query('DELETE FROM options WHERE id = ?', [req.params.id]);
        res.json({ message: 'Option deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error deleting option' });
    }
};
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
