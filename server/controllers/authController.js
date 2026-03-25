const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);

    try {
        // Check admins table first
        let [users] = await db.execute('SELECT *, "admin" as role FROM admins WHERE email = ?', [email]);
        
        // If not found in admins, check formateurs
        if (users.length === 0) {
            [users] = await db.execute('SELECT *, "formateur" as role FROM formateurs WHERE email = ?', [email]);
        }

        if (users.length === 0) {
            console.log(`[AUTH] User not found: ${email}`);
            return res.status(401).json({ message: 'User not found in DB.' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[AUTH] Password match result for ${email}:`, isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: `Password incorrect.` });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'supersecretkey123',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const table = req.user.role === 'admin' ? 'admins' : 'formateurs';
        const [users] = await db.execute(`SELECT id, name, email, "${req.user.role}" as role FROM ${table} WHERE id = ?`, [req.user.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, getMe };
