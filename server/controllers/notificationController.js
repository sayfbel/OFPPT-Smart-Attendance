const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const column = role === 'admin' ? 'admin_id' : 'formateur_id';

        const [notifications] = await pool.query(
            `SELECT * FROM notifications WHERE ${column} = ? ORDER BY created_at DESC LIMIT 50`,
            [userId]
        );
        res.json({ notifications });
    } catch (err) {
        console.error("GET NOTIFICATIONS ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const column = role === 'admin' ? 'admin_id' : 'formateur_id';

        await pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE id = ? AND ${column} = ?`,
            [id, userId]
        );
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error("MARK AS READ ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const column = role === 'admin' ? 'admin_id' : 'formateur_id';

        await pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE ${column} = ?`,
            [userId]
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error("MARK ALL AS READ ERROR:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};
