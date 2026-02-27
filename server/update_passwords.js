const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function updatePasswords() {
    try {
        console.log('--- Updating User Passwords Policy ---');
        const [users] = await pool.query('SELECT id, email, role FROM users WHERE role IN ("formateur", "stagiaire")');

        console.log(`Found ${users.length} users to update.`);

        for (const user of users) {
            const newPassword = user.email.split('@')[0];
            const hash = await bcrypt.hash(newPassword, 10);

            await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
            console.log(`Updated: ${user.email} -> ${newPassword}`);
        }

        console.log('--- Password Update Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('Error updating passwords:', err);
        process.exit(1);
    }
}

updatePasswords();
