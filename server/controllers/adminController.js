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
        const periodParam = req.query.period === 'monthly' ? 30 : 7;

        const [[{ total_students }]] = await pool.query("SELECT COUNT(*) as total_students FROM stagiaires");
        const [[{ total_formateurs }]] = await pool.query("SELECT COUNT(*) as total_formateurs FROM formateurs");
        const [[{ total_groups }]] = await pool.query("SELECT COUNT(*) as total_groups FROM groups");
        const [[{ total_reports }]] = await pool.query("SELECT COUNT(*) as total_reports FROM reports");

        // Total Theoretical Attendance Records (Total Expected across all reports)
        const [[{ total_theoretical }]] = await pool.query(`
            SELECT SUM(group_counts.cnt) as total_theoretical
            FROM reports r
            JOIN (SELECT group_id, COUNT(*) as cnt FROM stagiaires GROUP BY group_id) as group_counts 
            ON r.group_id = group_counts.group_id
        `);

        // Total Absences based on Justifier='ABSENCE'
        const [[{ total_absences }]] = await pool.query("SELECT COUNT(*) as total_absences FROM report_attendance WHERE Justifier = 'ABSENCE'");

        // Attendance Evolution based on period
        const [evolution] = await pool.query(`
            SELECT 
                DATE_FORMAT(r.date, '%Y-%m-%d') as date,
                SUM(group_counts.cnt) as total_expected,
                SUM(IFNULL(absences.abs_cnt, 0)) as absent_count
            FROM reports r
            JOIN (SELECT group_id, COUNT(*) as cnt FROM stagiaires GROUP BY group_id) as group_counts 
                ON r.group_id = group_counts.group_id
            LEFT JOIN (
                SELECT ra.report_id, COUNT(*) as abs_cnt 
                FROM report_attendance ra 
                WHERE ra.Justifier = 'ABSENCE' 
                GROUP BY ra.report_id
            ) as absences ON r.id = absences.report_id
            WHERE r.date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY r.date
            ORDER BY r.date ASC
        `, [periodParam]);

        // Generate a continuous sequence for the selected period
        const processedEvolution = [];
        for (let i = periodParam - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            
            // Generate local YYYY-MM-DD string to avoid timezone shifts from toISOString()
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const dayData = evolution.find(e => e.date === dateStr);
            
            // For monthly, show date for weekly show day name
            const label = periodParam > 7 
                ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
                : d.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase().replace('.', '');
            
            processedEvolution.push({
                name: label,
                // If there are zero absences, it is 100% presence (even if no reports).
                // If there are absences, we calculate based on the expected total.
                rate: (dayData && dayData.absent_count > 0)
                    ? Math.round(((dayData.total_expected - dayData.absent_count) / dayData.total_expected) * 100) 
                    : 100
            });
        }

        res.json({
            summary: {
                total_students,
                total_formateurs,
                total_groups,
                total_reports,
                global_rate: total_theoretical > 0 ? Math.round(((total_theoretical - total_absences) / total_theoretical) * 100) : 100,
                evolution: processedEvolution,
                distribution: [
                    { status: 'PRESENT', count: (total_theoretical || 0) - (total_absences || 0) },
                    { status: 'ABSENT', count: total_absences || 0 }
                ]
            }
        });
    } catch (err) {
        console.error("GET DASHBOARD SUMMARY ERROR:", err);
        res.status(500).json({ message: 'Server Error getting summary' });
    }
};

exports.createGroup = async (req, res, next) => {
    try {
        const { id, filiereId, lead, année_scolaire } = req.body;

        if (!id || !filiereId) {
            return res.status(400).json({ message: 'L\'ID du groupe et la filière sont obligatoires.' });
        }

        await pool.query(
            'INSERT INTO groups (id, filiereId, annee_scolaire) VALUES (?, ?, ?)',
            [id, filiereId, année_scolaire || '2025/2026']
        );

        // Sync supervisors
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[user]] = await pool.query('SELECT id FROM formateurs WHERE name = ?', [leadName]);
            if (user) {
                await pool.query('INSERT IGNORE INTO groups_supervisors (group_id, formateur_id) VALUES (?, ?)', [id, user.id]);
                // Ensure notification only if admin users table exists or handle formateur notification safely
                try {
                    await pool.query(
                        'INSERT INTO notifications (user_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                        [user.id, 'message', 'PLANNING', 'Nouveau Groupe Assigné', `Vous avez été assigné comme superviseur pour le groupe ${id}.`]
                    );
                } catch(err) { }
            }
        }

        // Link multiple salles if provided
        const salleIds = req.body.salleIds || (req.body.salleId ? [req.body.salleId] : []);
        if (salleIds.length > 0) {
            for (const sId of salleIds) {
                await pool.query('INSERT IGNORE INTO group_salles (group_id, salle_id) VALUES (?, ?)', [id, sId]);
            }
        }

        res.status(201).json({
            message: 'Group created successfully',
            group: { id, filiereId, annee_scolaire: année_scolaire, lead: leads.join(', '), students: 0 }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { filiereId, lead, année_scolaire } = req.body;

        if (!filiereId) {
            return res.status(400).json({ message: 'La filière est obligatoire.' });
        }

        await pool.query(
            'UPDATE groups SET filiereId = ?, annee_scolaire = ? WHERE id = ?',
            [filiereId, année_scolaire || '2025/2026', id]
        );

        // Sync supervisors
        await pool.query('DELETE FROM groups_supervisors WHERE group_id = ?', [id]);
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[user]] = await pool.query('SELECT id FROM formateurs WHERE name = ?', [leadName]);
            if (user) {
                await pool.query('INSERT IGNORE INTO groups_supervisors (group_id, formateur_id) VALUES (?, ?)', [id, user.id]);
            }
        }

        // Update room assignments (Many-to-Many)
        await pool.query('DELETE FROM group_salles WHERE group_id = ?', [id]);
        const salleIds = req.body.salleIds || (req.body.salleId ? [req.body.salleId] : []);
        if (salleIds.length > 0) {
            for (const sId of salleIds) {
                await pool.query('INSERT IGNORE INTO group_salles (group_id, salle_id) VALUES (?, ?)', [id, sId]);
            }
        }

        // Fetch updated object with count and leads
        const [[updatedGroup]] = await pool.query(`
            SELECT 
                c.*, f.nom as stream, s.nom as salle_nom,
                (SELECT COUNT(*) FROM stagiaires st WHERE st.group_id = c.id) as student_count,
                (SELECT GROUP_CONCAT(u_lead.name SEPARATOR ', ') FROM groups_supervisors cs JOIN formateurs u_lead ON cs.formateur_id = u_lead.id WHERE cs.group_id = c.id) as lead_formateurs
            FROM groups c 
            LEFT JOIN filiere f ON c.filiereId = f.id
            LEFT JOIN salles s ON c.salleId = s.id
            WHERE c.id = ?
        `, [id]);

        res.json({
            message: 'Group updated successfully',
            group: {
                id: updatedGroup.id,
                stream: updatedGroup.stream,
                filiereId: updatedGroup.filiereId,
                annee_scolaire: updatedGroup.annee_scolaire,
                lead: updatedGroup.lead_formateurs || '',
                students: updatedGroup.student_count
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        // Use a transaction or sequential deletes to handle constraints
        await pool.query('DELETE FROM groups_supervisors WHERE group_id = ?', [id]);
        await pool.query('UPDATE stagiaires SET group_id = NULL WHERE group_id = ?', [id]);

        const [result] = await pool.query('DELETE FROM groups WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Group not found in registry.' });
        }

        res.json({ message: 'Group purged from network.' });
    } catch (err) {
        console.error("DELETE GROUP ERROR:", err);
        res.status(500).json({ message: 'Error during group deletion.' });
    }
};

exports.getUsersByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const [supervisors] = await pool.query(`
            SELECT f.id, f.name, f.email, 'formateur' as role, c.group_id 
            FROM formateurs f 
            JOIN groups_supervisors c ON f.id = c.formateur_id 
            WHERE c.group_id = ?
        `, [groupId]);

        const [stagiaires] = await pool.query("SELECT NumInscription as id, name, group_id, 'stagiaire' as profession, qr_path, Active FROM stagiaires WHERE group_id = ?", [groupId]);

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
        const { name, role, group_id, filiereId, numInsc } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: 'Name and Role are mandatory.' });
        }

        if (role === 'stagiaire') {
            if (!numInsc) return res.status(400).json({ message: 'NumInscription est obligatoire pour les stagiaires.' });

            // 1. Create Stagiaire
            await pool.query(
                'INSERT INTO stagiaires (NumInscription, name, group_id, filiereId) VALUES (?, ?, ?, ?)',
                [numInsc, name, group_id || null, filiereId || null]
            );
            const stagiaireId = numInsc;

            // 2. Generate QR Code via Python
            const qrData = {
                Name: name,
                Group: group_id || "Unassigned",
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

            const [[newStagiaire]] = await pool.query('SELECT NumInscription as id, name, group_id, filiereId, qr_path FROM stagiaires WHERE NumInscription = ?', [stagiaireId]);

            // Notify Formateurs of the group
            const [supervisors] = await pool.query('SELECT formateur_id FROM groups_supervisors WHERE group_id = ?', [group_id]);
            for (const supervisor of supervisors) {
                await pool.query(
                    'INSERT INTO notifications (user_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                    [
                        supervisor.formateur_id,
                        'message',
                        'STAGIAIRE',
                        'Nouveau Stagiaire',
                        `Le stagiaire ${name} a été ajouté au groupe ${group_id}.`
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

            if (role === 'formateur' && group_id) {
                const groupIds = group_id.split(',').map(id => id.trim());
                for (const cid of groupIds) {
                    if (cid) {
                        await pool.query('INSERT IGNORE INTO groups_supervisors (group_id, formateur_id) VALUES (?, ?)', [cid, userId]);
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
        const { name, role, group_id, filiereId } = req.body;

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
                'UPDATE stagiaires SET name = ?, group_id = ?, filiereId = ? WHERE NumInscription = ?',
                [name, group_id || null, filiereId || null, id]
            );

            // 3. Generate New QR Code
            const qrData = {
                Name: name,
                Group: group_id || "Unassigned",
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

            const [[updated]] = await pool.query('SELECT NumInscription as id, name, group_id, filiereId, qr_path FROM stagiaires WHERE NumInscription = ?', [id]);
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

            if (role === 'formateur' && group_id) {
                await pool.query('DELETE FROM groups_supervisors WHERE formateur_id = ?', [id]);
                const groupIds = group_id.split(',').map(cid => cid.trim());
                for (const cid of groupIds) {
                    if (cid) {
                        await pool.query('INSERT IGNORE INTO groups_supervisors (group_id, formateur_id) VALUES (?, ?)', [cid, id]);
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
            await pool.query('DELETE FROM groups_supervisors WHERE formateur_id = ?', [id]);
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
            SELECT r.*, c.id as group_id, u.name as formateur_name,
            (SELECT GROUP_CONCAT(sl.nom SEPARATOR ', ') FROM group_salles gs JOIN salles sl ON gs.salle_id = sl.id WHERE gs.group_id = r.group_id) as salle_name
            FROM reports r
            JOIN groups c ON r.group_id = c.id
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
        const [admins] = await pool.query("SELECT id, name, email, 'admin' as role, NULL as group_id FROM admins");
        const [formateurs] = await pool.query(`
            SELECT f.id, f.name, f.email, 'formateur' as role, f.type,
                   GROUP_CONCAT(cs.group_id SEPARATOR ', ') as supervised_groups
            FROM formateurs f
            LEFT JOIN groups_supervisors cs ON f.id = cs.formateur_id
            GROUP BY f.id
        `);
        
        const [stagiaires] = await pool.query(`
            SELECT 
                s.NumInscription as id, s.name, s.group_id as group_id, 
                s.qr_path, s.Active,
                f.nom as filiere_name,
                c.annee_scolaire,
                (SELECT COUNT(*) FROM report_attendance ra WHERE ra.student_id = s.NumInscription AND ra.status = 'ABSENT') as absence_count,
                (SELECT COUNT(*) FROM report_attendance ra WHERE ra.student_id = s.NumInscription AND ra.status = 'LATE') as late_count,
                (SELECT ra.status FROM report_attendance ra JOIN reports r ON ra.report_id = r.id WHERE ra.student_id = s.NumInscription ORDER BY r.date DESC, r.created_at DESC LIMIT 1) as last_status,
                (SELECT ra.Justifier FROM report_attendance ra JOIN reports r ON ra.report_id = r.id WHERE ra.student_id = s.NumInscription ORDER BY r.date DESC, r.created_at DESC LIMIT 1) as last_justifier
            FROM stagiaires s
            LEFT JOIN filiere f ON s.filiereId = f.id
            LEFT JOIN groups c ON s.group_id = c.id
        `);
        
        const combined = [
            ...admins.map(a => ({ ...a, status: 'ACTIVE', lastLogin: 'Staff' })),
            ...formateurs.map(f => ({ 
                ...f, 
                groups: f.supervised_groups || '', 
                is_online: false,
                status: 'ACTIVE', 
                lastLogin: 'Staff' 
            })),
            ...stagiaires.map(s => ({ 
                ...s, 
                email: s.name ? String(s.name).replace(/\s/g, '').toLowerCase() + '@ofppt.ma' : 'student@ofppt.ma', 
                role: 'stagiaire', 
                filiere: s.filiere_name,
                group_id: s.group_id,
                annee_scolaire: s.annee_scolaire,
                status: s.Active ? 'ACTIVE' : 'INACTIVE', 
                lastLogin: 'No Login',
                absences: s.absence_count,
                lates: s.late_count,
                last_status: s.last_status,
                last_justifier: s.last_justifier
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
                s.group_id as class_id,
                r.date as session_date,
                r.subject,
                r.heure as session_time,
                f.name as formateur_name,
                (SELECT COUNT(*) FROM report_attendance WHERE student_id = s.NumInscription AND status = 'ABSENT' AND Justifier != 'JUSTIFIÉ') as total_absences,
                (SELECT COUNT(*) FROM suivieDisipline WHERE student_id = s.NumInscription) as total_blames
            FROM report_attendance ra
            JOIN stagiaires s ON ra.student_id = s.NumInscription
            JOIN reports r ON ra.report_id = r.id
            JOIN formateurs f ON r.formateur_id = f.id
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
        const newStatus = justified ? "JUSTIFIÉ" : "ABSENCE";
        await pool.query('UPDATE report_attendance SET Justifier = ? WHERE id = ?', [newStatus, recordId]);
        res.json({ message: `Absence marquée comme ${newStatus}.` });
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

        // Update the status in report_attendance to NON JUSTIFIÉ
        await pool.query(
            'UPDATE report_attendance SET Justifier = "NON JUSTIFIÉ" WHERE student_id = ? AND Justifier = "ABSENCE" ORDER BY id DESC LIMIT 1',
            [stagiaireId]
        );

        res.json({ message: 'Penalty assigned and status updated to NON JUSTIFIÉ.' });
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

exports.getGroups = async (req, res) => {
    try {
        const [groups] = await pool.query(`
            SELECT 
                g.*, 
                filiere.nom AS filiere_name, 
                filiere.nom AS filiere, 
                (SELECT COUNT(*) FROM stagiaires WHERE group_id = g.id) AS student_count,
                (SELECT GROUP_CONCAT(f.name SEPARATOR ', ') FROM groups_supervisors gs JOIN formateurs f ON gs.formateur_id = f.id WHERE gs.group_id = g.id) AS lead_formateurs,
                (SELECT GROUP_CONCAT(s.nom SEPARATOR ', ') FROM group_salles gsl JOIN salles s ON gsl.salle_id = s.id WHERE gsl.group_id = g.id) AS salle_nom,
                (SELECT GROUP_CONCAT(s.id) FROM group_salles gsl JOIN salles s ON gsl.salle_id = s.id WHERE gsl.group_id = g.id) AS salle_ids
            FROM groups g
            JOIN filiere ON g.filiereId = filiere.id
        `);

        res.json({ groups: groups.map(c => ({
            ...c, 
            students: c.student_count, 
            filiere: c.filiere_name, 
            salle_nom: c.salle_nom, 
            salleIds: c.salle_ids ? c.salle_ids.split(',').map(Number) : [],
            année_scolaire: c.annee_scolaire, 
            lead: c.lead_formateurs ? c.lead_formateurs.split(', ') : [] 
        })) });
    } catch (err) {
        console.error("GET GROUPS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting groups' });
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
        const { nom } = req.body;
        const [result] = await pool.query('INSERT INTO filiere (nom) VALUES (?)', [nom]);
        res.json({ id: result.insertId, nom });
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

exports.updateFiliere = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nom } = req.body;
        await pool.query('UPDATE filiere SET nom = ? WHERE id = ?', [nom, id]);
        res.json({ id, nom });
    } catch (err) {
        next(err);
    }
};

exports.getSalles = async (req, res, next) => {
    try {
        const [salles] = await pool.query(`
            SELECT s.*, 
            (SELECT GROUP_CONCAT(f.name SEPARATOR ', ') FROM groups_supervisors gs JOIN formateurs f ON gs.formateur_id = f.id JOIN group_salles gsl ON gs.group_id = gsl.group_id WHERE gsl.salle_id = s.id) as lead_formateurs,
            (SELECT GROUP_CONCAT(gs.group_id SEPARATOR ', ') FROM group_salles gs WHERE gs.salle_id = s.id) as assigned_groups
            FROM salles s
        `);
        res.json({ 
            salles: salles.map(s => ({
                ...s,
                groupIds: s.assigned_groups ? s.assigned_groups.split(', ') : []
            }))
        });
    } catch (err) {
        next(err);
    }
};

exports.createSalle = async (req, res, next) => {
    try {
        const { nom, groupIds } = req.body;
        const [result] = await pool.query('INSERT INTO salles (nom) VALUES (?)', [nom]);
        const salleId = result.insertId;

        // Link multiple groups if provided
        const groups = groupIds || (req.body.group_id ? [req.body.group_id] : []);
        if (groups.length > 0) {
            for (const gId of groups) {
                await pool.query('INSERT IGNORE INTO group_salles (group_id, salle_id) VALUES (?, ?)', [gId, salleId]);
            }
        }

        res.json({ id: salleId, nom });
    } catch (err) {
        next(err);
    }
};

exports.updateSalle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nom, groupIds } = req.body;
        await pool.query('UPDATE salles SET nom = ? WHERE id = ?', [nom, id]);

        // Update group assignments (Many-to-Many)
        await pool.query('DELETE FROM group_salles WHERE salle_id = ?', [id]);
        const groups = groupIds || (req.body.group_id ? [req.body.group_id] : []);
        if (groups.length > 0) {
            for (const gId of groups) {
                await pool.query('INSERT IGNORE INTO group_salles (group_id, salle_id) VALUES (?, ?)', [gId, id]);
            }
        }

        res.json({ id, nom });
    } catch (err) {
        next(err);
    }
};

exports.deleteSalle = async (req, res) => {
    try {
        await pool.query('DELETE FROM salles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Salle deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error deleting salle' });
    }
};

exports.getStudentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Basic Info
        const [student] = await pool.query(`
            SELECT s.*, f.nom as filiere_name
            FROM stagiaires s
            LEFT JOIN filiere f ON s.filiereId = f.id
            WHERE s.NumInscription = ?
        `, [id]);

        if (student.length === 0) {
            return res.status(404).json({ message: 'Stagiaire non trouvé' });
        }

        // 2. Absence History
        const [absences] = await pool.query(`
            SELECT ra.*, r.date, r.subject, r.heure, r.formateur_id
            FROM report_attendance ra
            JOIN reports r ON ra.report_id = r.id
            WHERE ra.student_id = ? AND ra.status = 'ABSENT'
            ORDER BY r.date DESC
        `, [id]);

        // 3. Discipline History
        const [discipline] = await pool.query(`
            SELECT *
            FROM suivieDisipline
            WHERE student_id = ?
            ORDER BY date DESC
        `, [id]);

        res.json({
            student: student[0],
            absences,
            discipline
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
