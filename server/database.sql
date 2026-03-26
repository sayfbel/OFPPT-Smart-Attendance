-- OFPPT Attendance System - Updated Schema with Filiere and Option Support
DROP DATABASE IF EXISTS ofppt_attendance;
CREATE DATABASE IF NOT EXISTS ofppt_attendance;
USE ofppt_attendance;

-- 1. Infrastructure Tables
CREATE TABLE IF NOT EXISTS filiere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    niveau VARCHAR(50) DEFAULT 'TS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filiereId INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    niveau VARCHAR(50) DEFAULT 'TS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS salles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Classes Registry
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY,
    annee_scolaire VARCHAR(50) DEFAULT '2025/2026',
    level VARCHAR(50) DEFAULT '1er',
    filiereId INT,
    optionId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE SET NULL,
    FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE SET NULL
);

-- 3. Core Actors (Split from users table)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS formateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('Parrain', 'Vacataire') DEFAULT 'Parrain',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stagiaires Registry
CREATE TABLE IF NOT EXISTS stagiaires (
    NumInscription VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id VARCHAR(50),
    annee VARCHAR(50) DEFAULT '1er',
    filiereId INT,
    optionId INT,
    Active BOOLEAN DEFAULT TRUE,
    qr_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE SET NULL,
    FOREIGN KEY (optionId) REFERENCES options(id) ON DELETE SET NULL
);

-- 5. Junction & Management
CREATE TABLE IF NOT EXISTS class_supervisors (
    class_id VARCHAR(50),
    formateur_id INT,
    PRIMARY KEY (class_id, formateur_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE
);

-- Timetable
CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(20) NOT NULL,
    time VARCHAR(50) NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    formateur_id INT,
    subject VARCHAR(255) NOT NULL,
    room VARCHAR(100) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL
);

-- 6. Reports & Attendance
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_code VARCHAR(50) UNIQUE NOT NULL,
    formateur_id INT NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    salle VARCHAR(100),
    salleId INT,
    heure VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (salleId) REFERENCES salles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS report_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    status ENUM('PRESENT', 'ABSENT') NOT NULL,
    Justifier BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS active_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    status ENUM('PRESENT', 'ABSENT') DEFAULT 'PRESENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 7. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Pointing to formateur or admin depends on context (may need split or generic)
    type ENUM('request', 'message', 'alert', 'success') DEFAULT 'message',
    category VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- SEEDING ---
-- (Admin: admin@ofppt.ma / admin123)
INSERT INTO admins (name, email, password) 
VALUES ('System Admin', 'admin@ofppt.ma', '$2a$10$vI8AAn.PyueTVUf4D6./juR3L6T/vT.hYj9f1.hS8GgJm.8G/5/mu')
ON DUPLICATE KEY UPDATE name='System Admin';
