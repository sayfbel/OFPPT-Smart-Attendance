const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper to save base64 to file
const saveBase64Image = (base64Data, subfolder, filename) => {
    if (!base64Data) return null;
    const base64Image = base64Data.split(';base64,').pop();
    const uploadDir = path.join(__dirname, '..', 'uploads', subfolder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
    return `/uploads/${subfolder}/${filename}`;
};

// Get STAGIAIRE profile
exports.getProfile = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [profile] = await pool.query(`
            SELECT u.id, u.name, u.email, u.role, u.class_id, u.image, c.title as class_name, c.stream 
            FROM users u
            LEFT JOIN classes c ON u.class_id = c.id
            WHERE u.id = ?
        `, [student_id]);

        if (profile.length === 0) {
            return res.status(404).json({ message: 'Neural Node not found.' });
        }

        res.json({ profile: profile[0] });
    } catch (err) {
        console.error("GET STAGIAIRE PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Neural disconnect.' });
    }
};

// Get STAGIAIRE schedule based on their class_id
exports.getSchedule = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [[user]] = await pool.query('SELECT class_id FROM users WHERE id = ?', [student_id]);

        if (!user || !user.class_id) {
            return res.status(200).json({ schedule: [] });
        }

        const [schedule] = await pool.query(`
            SELECT t.id, t.day, t.time, t.subject, t.room, u.name as formateur
            FROM timetable t
            LEFT JOIN users u ON t.formateur_id = u.id
            WHERE t.class_id = ?
        `, [user.class_id]);

        res.json({ schedule });
    } catch (err) {
        console.error("GET STAGIAIRE SCHEDULE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Temporal drift.' });
    }
};

// Get STAGIAIRE absences
exports.getAbsences = async (req, res) => {
    try {
        const student_id = req.user.id;
        const [absences] = await pool.query(`
            SELECT ra.id, ra.status, r.date, r.subject, r.heure, r.salle, r.status as record_status
            FROM report_attendance ra
            JOIN reports r ON ra.report_id = r.id
            WHERE ra.student_id = ? AND ra.status = 'ABSENT'
            ORDER BY r.date DESC
        `, [student_id]);

        res.json({ absences });
    } catch (err) {
        console.error("GET STAGIAIRE ABSENCES ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Archive corrupted.' });
    }
};

// Update STAGIAIRE profile (specifically image)
exports.updateProfile = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { image } = req.body;

        if (!image) return res.status(400).json({ message: 'No image data provided.' });

        const filename = `profile_${student_id}_${Date.now()}.jpg`;
        const relativePath = saveBase64Image(image, 'profiles', filename);

        await pool.query('UPDATE users SET image = ? WHERE id = ?', [relativePath, student_id]);

        res.json({ message: 'Neural Identity updated.', path: relativePath });
    } catch (err) {
        console.error("UPDATE STAGIAIRE PROFILE ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Identity rewrite failed.' });
    }
};

// Update STAGIAIRE Face ID (multi-angle scan)
exports.updateFaceId = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { faces } = req.body; // Expecting { front, left, right }

        if (!faces || !faces.front) {
            return res.status(400).json({ message: 'Invalid face telemetry data.' });
        }

        const savedPaths = {};
        for (const [angle, base64] of Object.entries(faces)) {
            if (base64) {
                const filename = `face_${student_id}_${angle}_${Date.now()}.jpg`;
                savedPaths[angle] = saveBase64Image(base64, 'faceids', filename);
            }
        }

        await pool.query('UPDATE users SET face_id = ? WHERE id = ?', [JSON.stringify(savedPaths), student_id]);

        res.json({ message: 'Biometric Face ID synchronized.', paths: savedPaths });
    } catch (err) {
        console.error("UPDATE STAGIAIRE FACE ID ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Biometric rewrite failed.' });
    }
};

// Save Generated Identity Card
exports.saveIdentityCard = async (req, res) => {
    try {
        const student_id = req.user.id;
        const { cardImage } = req.body;

        if (!cardImage) return res.status(400).json({ message: 'No card image data.' });

        const filename = `card_${student_id}_${Date.now()}.png`;
        const relativePath = saveBase64Image(cardImage, 'cards', filename);

        res.json({ message: 'Identity Card archived in neural vault.', path: relativePath });
    } catch (err) {
        console.error("SAVE IDENTITY CARD ERROR:", err);
        res.status(500).json({ message: 'Internal Server Error: Archive failed.' });
    }
};
