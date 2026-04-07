const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formateurRoutes = require('./routes/formateurRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files - Neural Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/formateur', formateurRoutes);
app.use('/api/notifications', notificationRoutes);


// Central Error Response Node
app.use(errorMiddleware);


const pool = require('./config/db');

const initDatabase = async () => {
    try {
        console.log('--- Database Initialization Protocol ---');
        const fs = require('fs');
        const path = require('path');
        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split SQL by semicolons, but be careful with seeded values
        // Better to use multipleStatements: true in connection, but pool.query also supports it in some drivers
        // However, we'll use a single block query since mysql2 supports it if configured
        
        // Actually, we'll just run it as one block if multipleStatements is enabled in config/db.js
        // If not, we'll need to create a temporary connection
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('⏳ Starting Database Initialization...');
        await connection.query(sql);
        console.log('✅ Database schema and seed data synchronized from database.sql');
        await connection.end();
    } catch (err) {
        console.error('❌ Database Initialization Failed:', err.message);
    }
};

// initDatabase();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
