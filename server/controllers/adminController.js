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
                    c.*, f.nom as filiere_name,
                    (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count,
                    GROUP_CONCAT(u_lead.name SEPARATOR ', ') as lead_formateurs
                FROM classes c
                LEFT JOIN filiere f ON c.filiereId = f.id
                LEFT JOIN class_supervisors cs ON c.id = cs.class_id
                LEFT JOIN formateurs u_lead ON cs.formateur_id = u_lead.id
                GROUP BY c.id
            `);
        } catch (dbErr) {
            console.error("DB Error. Tables might not exist:", dbErr.message);
        }

        res.json({
            classes: classes.map(c => ({
                id: c.id,
                filiere: c.filiere_name || 'N/A',
                année_scolaire: c.annee_scolaire,
                filiereId: c.filiereId,
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

exports.createClass = async (req, res, next) => {
    try {
        const { id, filiereId, lead, année_scolaire, level } = req.body;

        if (!id || !filiereId) {
            return res.status(400).json({ message: 'L\'ID du groupe et la filière sont obligatoires.' });
        }

        await pool.query(
            'INSERT INTO classes (id, filiereId, annee_scolaire) VALUES (?, ?, ?)',
            [id, filiereId, année_scolaire || '2025/2026']
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

        if (!filiereId) {
            return res.status(400).json({ message: 'La filière est obligatoire.' });
        }

        await pool.query(
            'UPDATE classes SET filiereId = ?, annee_scolaire = ? WHERE id = ?',
            [filiereId, année_scolaire || '2025/2026', id]
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
                c.*, f.nom as stream,
                (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count,
                (SELECT GROUP_CONCAT(u_lead.name SEPARATOR ', ') FROM class_supervisors cs JOIN formateurs u_lead ON cs.formateur_id = u_lead.id WHERE cs.class_id = c.id) as lead_formateurs
            FROM classes c 
            LEFT JOIN filiere f ON c.filiereId = f.id
            WHERE c.id = ?
        `, [id]);

        res.json({
            message: 'Class updated successfully',
            class: {
                id: updatedClass.id,
                filiere: updatedClass.stream,
                filiereId: updatedClass.filiereId,
                année_scolaire: updatedClass.annee_scolaire,
                lead: updatedClass.lead_formateurs || '',
                students: updatedClass.student_count
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Use a transaction or sequential deletes to handle constraints
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


exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const [supervisors] = await pool.query(`
            SELECT f.id, f.name, f.email, 'formateur' as role, c.class_id 
            FROM formateurs f 
            JOIN class_supervisors c ON f.id = c.formateur_id 
            WHERE c.class_id = ?
        `, [classId]);

        const [stagiaires] = await pool.query("SELECT NumInscription as id, name, class_id, 'stagiaire' as profession, qr_path, Active FROM stagiaires WHERE class_id = ?", [classId]);

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

exports.createUser = async (req, res, next) => {
    try {
        const { name, role, class_id, filiereId, annee, numInsc } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
            if (!numInsc) return res.status(400).json({ message: 'NumInscription est obligatoire pour les stagiaires.' });

            // 1. Create Stagiaire in new table
            await pool.query(
                'INSERT INTO stagiaires (NumInscription, name, class_id, filiereId) VALUES (?, ?, ?, ?)',
                [numInsc, name, class_id || null, filiereId || null]
            );
            const stagiaireId = numInsc;

            // 2. Generate QR Code via Python
            const qrData = {
                Name: name,
                Group: class_id || "Unassigned",
                Institute: "OFPPT ISTA",
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

            const [[newStagiaire]] = await pool.query('SELECT NumInscription as id, name, class_id, filiereId, qr_path FROM stagiaires WHERE NumInscription = ?', [stagiaireId]);

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

            const table = role === 'admin' ? 'admins' : 'formateurs';
            
            const [result] = await pool.query(
                `INSERT INTO ${table} (name, email, password${role === 'formateur' ? ', type' : ''}) VALUES (?, ?, ?${role === 'formateur' ? ", 'Parrain'" : ''})`,
                [name, email, hash]
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

            const [[newUser]] = await pool.query(`SELECT id, name, email, '${role}' as role FROM ${table} WHERE id = ?`, [userId]);
            res.status(201).json({
                message: 'Staff identity successfully initialized.',
                user: { ...newUser, status: 'ACTIVE', lastLogin: 'Staff' }
            });
        }
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, class_id, filiereId, annee } = req.body;

        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
            // 1. Get old QR path to delete it
            const [[oldRecord]] = await pool.query('SELECT qr_path FROM stagiaires WHERE NumInscription = ?', [id]);

            if (oldRecord && oldRecord.qr_path) {
                const absoluteOldPath = path.join(__dirname, '..', oldRecord.qr_path);
                if (fs.existsSync(absoluteOldPath)) {
                    fs.unlinkSync(absoluteOldPath);
                }
            }

            // 2. Update basic info
            await pool.query(
                'UPDATE stagiaires SET name = ?, class_id = ?, filiereId = ? WHERE NumInscription = ?',
                [name, class_id || null, filiereId || null, id]
            );

            // 3. Generate New QR Code
            const qrData = {
                Name: name,
                Group: class_id || "Unassigned",
                Institute: "OFPPT ISTA",
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

            const [[updated]] = await pool.query('SELECT NumInscription as id, name, class_id, filiereId, qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
            res.json({ message: 'Stagiaire updated. New QR generated.', user: { ...updated, role: 'stagiaire' } });
        } else {
            const email = name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt.ma';
            const defaultPassword = email.split('@')[0];
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash(defaultPassword, 10);

            const table = role === 'admin' ? 'admins' : 'formateurs';

            await pool.query(
                `UPDATE ${table} SET name = ?, email = ?, password = ? WHERE id = ?`,
                [name, email, hash, id]
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
            const [[updated]] = await pool.query(`SELECT id, name, email, '${role}' as role FROM ${table} WHERE id = ?`, [id]);
            res.json({ message: 'Staff identity updated.', user: updated });
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        if (role === 'stagiaire') {
            const [[user]] = await pool.query('SELECT qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
            if (user && user.qr_path) {
                const absolutePath = path.join(__dirname, '..', user.qr_path);
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            }
            await pool.query('DELETE FROM stagiaires WHERE NumInscription = ?', [id]);
        } else {
            await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);
            const table = role === 'admin' ? 'admins' : 'formateurs';
            await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
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
            SELECT r.*, c.id as class_id, u.name as formateur_name
            FROM reports r
            JOIN classes c ON r.class_id = c.id
            JOIN formateurs u ON r.formateur_id = u.id
            ORDER BY r.date DESC, r.created_at DESC
        `);

        // Fetch students for each report (now joining with stagiaires table)
        const reportsWithStagiaires = await Promise.all(reports.map(async (report) => {
            const [stagiaires] = await pool.query(`
                SELECT ra.student_id as id, s.name as name, ra.status 
                FROM report_attendance ra
                JOIN stagiaires s ON ra.student_id = s.NumInscription
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
        ];

        res.json({ users: combined });
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

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
    } catch (err) {
        console.error("GET CLASSES ERROR:", err);
        res.status(500).json({ message: 'Server Error getting classes' });
    }
};


exports.getFilieres = async (req, res) => {
    try {
        const [filieres] = await pool.query('SELECT * FROM filiere');
        res.json({ filieres });
    } catch (err) {
        res.status(500).json({ message: 'Server Error getting filieres' });
    }
};


exports.createFiliere = async (req, res, next) => {
    try {
        const { nom, niveau } = req.body;
        const [result] = await pool.query('INSERT INTO filiere (nom, niveau) VALUES (?, ?)', [nom, niveau || 'TS']);
        res.json({ id: result.insertId, nom, niveau });
    } catch (err) {
        next(err);
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

