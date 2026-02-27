const pool = require('../config/db');

exports.getFormateurs = async (req, res) => {
    try {
        const [formateurs] = await pool.query('SELECT id, name, email FROM users WHERE role = ?', ['formateur']);
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
            [timetable] = await pool.query(`
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
            schedule: timetable
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

exports.getUsersByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        // make sure column exists in users
        try {
            await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS class_id VARCHAR(50)');
        } catch (e) { }

        const [users] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE class_id = ?', [classId]);
        res.json({ users: users.map(u => ({ ...u, status: 'ACTIVE', lastLogin: 'Just now' })) });
    } catch (err) {
        console.error("GET USERS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting users' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, role, class_id } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ message: 'Name, Email, and Role are mandatory.' });
        }

        // Use the first part of email as default password
        const defaultPassword = email.split('@')[0];
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash(defaultPassword, 10);

        // For stagiaires, class_id must be a single valid ID
        // For formateurs, class_id might be a comma-separated string from frontend
        let main_class_id = null;
        if (role === 'stagiaire') {
            if (!class_id) return res.status(400).json({ message: 'Squadron ID is required for Stagiaires.' });
            main_class_id = class_id;
        } else if (role === 'formateur' && class_id) {
            // Take the first one for the user record if multiple provided
            main_class_id = class_id.split(',')[0].trim();
        }

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, class_id) VALUES (?, ?, ?, ?, ?)',
            [name, email, hash, role, main_class_id]
        );

        const userId = result.insertId;

        // If it's a formateur, sync the supervisors junction table
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
            message: 'Identity successfully initialized in the network.',
            user: { ...newUser, status: 'ACTIVE', lastLogin: 'Just now' }
        });
    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Identity Token (Email) already exists in registry.' });
        if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ message: 'Invalid Squadron Identifier provided.' });
        res.status(500).json({ message: 'Neural Link Failure: Internal Server Error during identity creation.' });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, class_id } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: 'Name, Email, and Role are mandatory.' });
        }

        let main_class_id = null;
        if (role === 'stagiaire') {
            main_class_id = class_id;
        } else if (role === 'formateur' && class_id) {
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

        const [[updatedUser]] = await pool.query('SELECT id, name, email, role, class_id FROM users WHERE id = ?', [id]);
        res.json({ message: 'Identity updated successfully.', user: updatedUser });
    } catch (err) {
        console.error("UPDATE USER ERROR:", err);
        res.status(500).json({ message: 'Neural Link Failure: Internal Server Error during identity update.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Cleanup junction tables first
        await pool.query('DELETE FROM class_supervisors WHERE formateur_id = ?', [id]);

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Identity not found in registry.' });
        }

        res.json({ message: 'Identity purged from network.' });
    } catch (err) {
        console.error("DELETE USER ERROR:", err);
        res.status(500).json({ message: 'Neural Link Failure: Error during identity deletion.' });
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

        // Fetch students for each report
        const reportsWithStagiaires = await Promise.all(reports.map(async (report) => {
            const [stagiaires] = await pool.query(`
                SELECT ra.student_id as id, u.name as name, ra.status 
                FROM report_attendance ra
                JOIN users u ON ra.student_id = u.id
                WHERE ra.report_id = ?
            `, [report.id]);
            return {
                ...report,
                stagiaires: stagiaires.map(s => ({
                    id: s.id,
                    name: s.name,
                    status: s.status // PRESENT or ABSENT
                }))
            };
        }));

        res.json({ reports: reportsWithStagiaires });
    } catch (err) {
        console.error("GET REPORTS ERROR:", err);
        res.status(500).json({ message: 'Server Error getting reports' });
    }
};
