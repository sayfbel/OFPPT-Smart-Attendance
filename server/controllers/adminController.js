const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

exports.getFormateurs = async (req, res) => {
    try {
        const [formateurs] = await pool.query("SELECT id, name, email, type, 'formateur' as role FROM formateurs");
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
        const [classes] = await pool.query(`
            SELECT 
                c.id, c.année_scolaire, c.level, c.filiereId, c.optionId,
                f.nom as filiere, o.nom as option,
                (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count,
                (SELECT GROUP_CONCAT(f.name SEPARATOR ', ') FROM class_supervisors cs JOIN formateurs f ON cs.formateur_id = f.id WHERE cs.class_id = c.id) as lead_formateurs
            FROM classes c
            LEFT JOIN filiere f ON c.filiereId = f.id
            LEFT JOIN options o ON c.optionId = o.id
        `);
        
        const [schedule] = await pool.query(`
            SELECT t.id, t.day, t.time, t.class_id as class, f.name as formateur, t.subject, t.room 
            FROM timetable t
            LEFT JOIN formateurs f ON t.formateur_id = f.id
        `);

        res.json({
            classes: classes.map(c => ({
                id: c.id,
                filiere: c.filiere || 'N/A',
                option: c.option || 'N/A',
                filiereId: c.filiereId,
                optionId: c.optionId,
                année_scolaire: c.année_scolaire,
                level: c.level,
                lead: c.lead_formateurs || '',
                students: c.student_count
            })),
            schedule: schedule
        });
    } catch (err) {
        console.error("GET SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Error fetching schedule: ' + err.message });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { id, filiereId, optionId, lead, année_scolaire, level } = req.body;

        if (!id || !filiereId || !optionId) {
            return res.status(400).json({ 
                message: 'Informations manquantes: ' + 
                (!id ? 'Code groupe, ' : '') + 
                (!filiereId ? 'Filière, ' : '') + 
                (!optionId ? 'Option, ' : '')
            });
        }

        const leadStr = lead || "";

        await pool.query(
            'INSERT INTO classes (id, filiereId, optionId, année_scolaire, level) VALUES (?, ?, ?, ?, ?)',
            [id, filiereId || null, optionId || null, année_scolaire || '2025/2026', level || '1er']
        );

        // Sync supervisors
        const leads = Array.isArray(leadStr) ? leadStr : (leadStr ? leadStr.split(',').map(s => s.trim()) : []);

        for (const leadName of leads) {
            const [[formateur]] = await pool.query('SELECT id FROM formateurs WHERE name = ?', [leadName]);
            if (formateur) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [id, formateur.id]);
                await pool.query(
                    'INSERT INTO notifications (formateur_id, type, category, title, message) VALUES (?, ?, ?, ?, ?)',
                    [formateur.id, 'message', 'PLANNING', 'Nouveau Groupe Assigné', `Vous avez été assigné comme superviseur pour le groupe ${id}.`]
                );
            }
        }

        res.status(201).json({
            message: 'Class created successfully',
            class: { 
                id, filiereId, optionId, 
                année_scolaire: année_scolaire || '2025/2026', 
                level: level || '1er',
                lead: leads.join(', '), students: 0 
            }
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

        if (!filiereId || !optionId || !lead) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await pool.query(
            'UPDATE classes SET filiereId = ?, optionId = ?, année_scolaire = ?, level = ? WHERE id = ?',
            [filiereId, optionId, année_scolaire, level, id]
        );

        // Sync supervisors
        await pool.query('DELETE FROM class_supervisors WHERE class_id = ?', [id]);
        const leads = Array.isArray(lead) ? lead : (lead ? lead.split(',').map(s => s.trim()) : []);
        for (const leadName of leads) {
            const [[formateur]] = await pool.query('SELECT id FROM formateurs WHERE name = ?', [leadName]);
            if (formateur) {
                await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [id, formateur.id]);
            }
        }

        // Fetch updated object
        const [classes] = await pool.query(`
            SELECT 
                c.id, c.année_scolaire, c.level, c.filiereId, c.optionId,
                f.nom as filiere, o.nom as option,
                (SELECT COUNT(*) FROM stagiaires s WHERE s.class_id = c.id) as student_count,
                (SELECT GROUP_CONCAT(f.name SEPARATOR ', ') FROM class_supervisors cs JOIN formateurs f ON cs.formateur_id = f.id WHERE cs.class_id = c.id) as lead_formateurs
            FROM classes c 
            LEFT JOIN filiere f ON c.filiereId = f.id
            LEFT JOIN options o ON c.optionId = o.id
            WHERE c.id = ?
        `, [id]);
        
        const updatedClass = classes[0];

        res.json({
            message: 'Class updated successfully',
            class: {
                id: updatedClass.id,
                filiere: updatedClass.filiere || 'N/A',
                option: updatedClass.option || 'N/A',
                filiereId: updatedClass.filiereId,
                optionId: updatedClass.optionId,
                année_scolaire: updatedClass.année_scolaire,
                level: updatedClass.level,
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
        await pool.query('DELETE FROM classes WHERE id = ?', [id]);
        res.json({ message: 'Class deleted successfully.' });
    } catch (err) {
        console.error("DELETE CLASS ERROR:", err);
        res.status(500).json({ message: 'Error during class deletion.' });
    }
};

exports.recreateClassesForNewYear = async (req, res) => {
    try {
        const { currentYear, nextYear } = req.body;
        if (!currentYear || !nextYear) return res.status(400).json({ message: 'Current and Next year are required.' });

        // Get all classes from current year
        const [oldClasses] = await pool.query('SELECT * FROM classes WHERE année_scolaire = ?', [currentYear]);

        for (const cls of oldClasses) {
            // Check if already exists for next year
            const [[exists]] = await pool.query('SELECT id FROM classes WHERE id = ? AND année_scolaire = ?', [cls.id, nextYear]);
            if (!exists) {
                // Increate level if possible
                let nextLevel = cls.level;
                if (cls.level === '1er') nextLevel = '2eme';
                else if (cls.level === '2eme') nextLevel = '3eme';
                
                await pool.query(
                    'INSERT INTO classes (id, filiereId, optionId, année_scolaire, level) VALUES (?, ?, ?, ?, ?)',
                    [cls.id, cls.filiereId, cls.optionId, nextYear, nextLevel]
                );

                // Re-assign supervisors but NOT students
                const [supervisors] = await pool.query('SELECT formateur_id FROM class_supervisors WHERE class_id = ?', [cls.id]);
                for (const s of supervisors) {
                    await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [cls.id, s.formateur_id]);
                }
            }
        }

        res.json({ message: `Classes successfully prepared for ${nextYear}. Students list is fresh.` });
    } catch (err) {
        console.error("RECREATE CLASSES ERROR:", err);
        res.status(500).json({ message: 'Server Error during year transition' });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, room, formateur_id, time, day } = req.body;

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
        await pool.query('DELETE FROM timetable WHERE id = ?', [id]);
        res.json({ message: 'Schedule deleted successfully.' });
    } catch (error) {
        console.error("DELETE SCHEDULE ERROR:", error);
        res.status(500).json({ message: 'Server Error deleting schedule' });
    }
};

exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        // Fetch Formateurs assigned to this class via class_supervisors
        const [formateurs] = await pool.query(`
            SELECT f.id, f.name, f.email, "formateur" as role 
            FROM formateurs f
            JOIN class_supervisors cs ON f.id = cs.formateur_id
            WHERE cs.class_id = ?
        `, [classId]);

        // Fetch Stagiaires
        const [stagiaires] = await pool.query('SELECT NumInscription as id, name, class_id, "stagiaire" as role, qr_path, Année, filiereId, optionId, Active FROM stagiaires WHERE class_id = ?', [classId]);

        const combined = [
            ...formateurs.map(f => ({ ...f, status: 'ACTIVE', lastLogin: 'Staff' })),
            ...stagiaires.map(s => ({ 
                ...s, 
                status: s.Active ? 'ACTIVE' : 'INACTIVE', 
                lastLogin: 'No Login' 
            }))
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
            const { Année, filiereId, optionId, Active } = req.body;
            // Option only for 2nd and 3rd year
            const finalOptionId = (Année === '1er') ? null : optionId;

            const [result] = await pool.query(
                'INSERT INTO stagiaires (name, class_id, Année, filiereId, optionId, Active) VALUES (?, ?, ?, ?, ?, ?)', 
                [name, class_id, Année || '1er', filiereId || null, finalOptionId || null, Active !== undefined ? Active : true]
            );
            const sid = result.insertId;
            
            // Generate QR Code
            const qrData = { 
                Name: name, 
                Group: class_id, 
                NumInscription: sid,
                Année: Année || "1er",
                Profession: "stagiaire" 
            };
            const script = path.join(__dirname, '../generate_qr.py');
            const proc = spawn('py', [script, JSON.stringify(qrData)]);
            
            let qrPath = '';
            proc.stdout.on('data', (data) => qrPath = '/uploads/card_id/' + path.basename(data.toString().trim()));
            await new Promise((r) => proc.on('close', r));
            
            if (qrPath) await pool.query('UPDATE stagiaires SET qr_path = ? WHERE NumInscription = ?', [qrPath, sid]);

            // Notify Formateurs
            const [supervisors] = await pool.query('SELECT formateur_id FROM class_supervisors WHERE class_id = ?', [class_id]);
            for (const s of supervisors) {
                await pool.query('INSERT INTO notifications (formateur_id, type, category, title, message) VALUES (?, "message", "STAGIAIRE", "Nouveau Stagiaire", ?)', 
                    [s.formateur_id, `Le stagiaire ${name} a été ajouté au groupe ${class_id}.`]);
            }

            const [[newStag]] = await pool.query('SELECT NumInscription as id, name, class_id, qr_path, Année, filiereId, optionId, Active FROM stagiaires WHERE NumInscription = ?', [sid]);
            return res.status(201).json({ message: 'Stagiaire created.', user: { ...newStag, role: 'stagiaire' } });

        } else {
            const bcrypt = require('bcryptjs');
            const type = req.body.type || 'Parrain';
            const email = req.body.email || (name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt-edu.ma');
            
            const hash = await bcrypt.hash(email.split('@')[0], 10);
            const table = role === 'admin' ? 'admins' : 'formateurs';
            
            let query = `INSERT INTO ${table} (name, email, password) VALUES (?, ?, ?)`;
            let params = [name, email, hash];

            if (role === 'formateur') {
                query = `INSERT INTO ${table} (name, email, password, type) VALUES (?, ?, ?, ?)`;
                params = [name, email, hash, type];
            }
            
            const [result] = await pool.query(query, params);
            const uid = result.insertId;

            if (role === 'formateur' && class_id) {
                const cids = class_id.split(',').map(id => id.trim());
                for (const cid of cids) {
                    if (cid) await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [cid, uid]);
                }
            }

            const [[newUser]] = await pool.query(`SELECT id, name, email, ${role === 'formateur' ? 'type' : "'Staff' as type"} FROM ${table} WHERE id = ?`, [uid]);
            res.status(201).json({ message: 'Staff created.', user: { ...newUser, role } });
        }
    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, class_id } = req.body;
        const table = role === 'admin' ? 'admins' : 'formateurs';

        if (role === 'stagiaire') {
            const { Année, filiereId, optionId, Active } = req.body;
            const finalOptionId = (Année === '1er') ? null : optionId;
            await pool.query(
                'UPDATE stagiaires SET name = ?, class_id = ?, Année = ?, filiereId = ?, optionId = ?, Active = ? WHERE NumInscription = ?', 
                [name, class_id, Année, filiereId, finalOptionId, Active, id]
            );
            
            const [[user]] = await pool.query('SELECT NumInscription as id, name, class_id, qr_path, Année, filiereId, optionId, Active FROM stagiaires WHERE NumInscription = ?', [id]);
            res.json({ message: 'Stagiaire updated.', user: { ...user, role: 'stagiaire' } });
        } else {
            const type = req.body.type || 'Parrain';
            const email = req.body.email || (name.trim().toLowerCase().replace(/\s+/g, '.') + '@ofppt-edu.ma');

            let query = `UPDATE ${table} SET name = ?, email = ? WHERE id = ?`;
            let params = [name, email, id];

            if (role === 'formateur') {
                query = `UPDATE ${table} SET name = ?, email = ?, type = ? WHERE id = ?`;
                params = [name, email, type, id];
            }

            await pool.query(query, params);
            
            if (role === 'formateur') {
                await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);
                if (class_id) {
                    const cids = class_id.split(',').map(cid => cid.trim());
                    for (const cid of cids) {
                        if (cid) await pool.query('INSERT IGNORE INTO class_supervisors (class_id, formateur_id) VALUES (?, ?)', [cid, id]);
                    }
                }
            }
            const [[user]] = await pool.query(`SELECT id, name, email, ${role === 'formateur' ? 'type' : "'Staff' as type"} FROM ${table} WHERE id = ?`, [id]);
            res.json({ message: 'Staff updated.', user: { ...user, role } });
        }
    } catch (err) {
        console.error("UPDATE USER ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;
        if (role === 'stagiaire') {
            await pool.query('DELETE FROM stagiaires WHERE NumInscription = ?', [id]);
        } else {
            const table = role === 'admin' ? 'admins' : 'formateurs';
            await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
        }
        res.json({ message: 'User deleted.' });
    } catch (err) {
        console.error("DELETE USER ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getReports = async (req, res) => {
    try {
        const [reports] = await pool.query(`
            SELECT r.*, c.id as class_title, f.name as formateur_name, s.nom as salle_official_name
            FROM reports r
            JOIN classes c ON r.class_id = c.id
            JOIN formateurs f ON r.formateur_id = f.id
            LEFT JOIN salles s ON r.salleId = s.id
            ORDER BY r.date DESC, r.created_at DESC
        `);

        for (let r of reports) {
            const [stags] = await pool.query('SELECT ra.student_id as id, s.name, ra.status, ra.Justifier FROM report_attendance ra JOIN stagiaires s ON ra.student_id = s.NumInscription WHERE ra.report_id = ?', [r.id]);
            r.stagiaires = stags;
        }

        res.json({ reports });
    } catch (err) {
        console.error("GET REPORTS ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- Infrastructure Management ---

exports.getFilieres = async (req, res) => {
    try {
        const [filieres] = await pool.query('SELECT * FROM filiere');
        res.json({ filieres });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createFiliere = async (req, res) => {
    try {
        const { nom, niveau } = req.body;
        const [result] = await pool.query('INSERT INTO filiere (nom, niveau) VALUES (?, ?)', [nom, niveau]);
        res.status(201).json({ id: result.insertId, nom, niveau });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFiliere = async (req, res) => {
    try {
        await pool.query('DELETE FROM filiere WHERE id = ?', [req.params.id]);
        res.json({ message: 'Filiére supprimée' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOptions = async (req, res) => {
    try {
        const [options] = await pool.query('SELECT o.*, f.nom as filiere_nom FROM options o JOIN filiere f ON o.filiereId = f.id');
        res.json({ options });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOption = async (req, res) => {
    try {
        const { filiereId, nom, niveau } = req.body;
        const [result] = await pool.query('INSERT INTO options (filiereId, nom, niveau) VALUES (?, ?, ?)', [filiereId, nom, niveau]);
        res.status(201).json({ id: result.insertId, filiereId, nom, niveau });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteOption = async (req, res) => {
    try {
        await pool.query('DELETE FROM options WHERE id = ?', [req.params.id]);
        res.json({ message: 'Option supprimée' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSalles = async (req, res) => {
    try {
        const [salles] = await pool.query('SELECT * FROM salles');
        res.json({ salles });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSalle = async (req, res) => {
    try {
        const { nom } = req.body;
        const [result] = await pool.query('INSERT INTO salles (nom) VALUES (?)', [nom]);
        res.status(201).json({ id: result.insertId, nom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteSalle = async (req, res) => {
    try {
        await pool.query('DELETE FROM salles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Salle supprimée' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
