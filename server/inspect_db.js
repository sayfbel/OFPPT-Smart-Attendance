const pool = require('./config/db');

async function inspect() {
    try {
        const [users] = await pool.query('SHOW CREATE TABLE users');
        const [classes] = await pool.query('SHOW CREATE TABLE classes');
        console.log('USERS TABLE:', users[0]['Create Table']);
        console.log('CLASSES TABLE:', classes[0]['Create Table']);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspect();
