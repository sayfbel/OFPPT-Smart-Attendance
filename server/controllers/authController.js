const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log(`[AUTH] User not found: ${email}`);
            return res.status(401).json({ message: 'User not found in DB.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[AUTH] Password match result for ${email}:`, isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: `Password incorrect. Hash prefix: ${user.password.substring(0, 10)}` });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                class_id: user.class_id
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, class_id FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, getMe };
