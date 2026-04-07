-- OFPPT Attendance System - Clean Schema Initialization
CREATE DATABASE IF NOT EXISTS ofppt_attendance;
USE ofppt_attendance;

-- 0. Cleanup existing tables in correct order (reverse dependencies)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS suivieDisipline;
DROP TABLE IF EXISTS report_attendance;
DROP TABLE IF EXISTS active_checkins;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS groups_supervisors;
DROP TABLE IF EXISTS stagiaires;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS formateurs;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS salles;
DROP TABLE IF EXISTS filiere;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Infrastructure Tables
CREATE TABLE filiere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Groups Registry
CREATE TABLE groups (
    id VARCHAR(50) PRIMARY KEY,
    annee_scolaire VARCHAR(50) DEFAULT '2025/2026',
    filiereId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE SET NULL
);

-- 3. Core Actors
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE formateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('Parrain', 'Vacataire') DEFAULT 'Parrain',
    first_login BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stagiaires Registry
CREATE TABLE stagiaires (
    NumInscription VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    group_id VARCHAR(50),
    filiereId INT,
    Active BOOLEAN DEFAULT TRUE,
    qr_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (filiereId) REFERENCES filiere(id) ON DELETE SET NULL
);

-- 5. Junction & Management
CREATE TABLE groups_supervisors (
    group_id VARCHAR(50),
    formateur_id INT,
    PRIMARY KEY (group_id, formateur_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE
);

-- 6. Reports & Attendance
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_code VARCHAR(50) UNIQUE NOT NULL,
    formateur_id INT NOT NULL,
    group_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    salleId INT,
    heure VARCHAR(100),
    signature LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (salleId) REFERENCES salles(id) ON DELETE SET NULL
);

CREATE TABLE report_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL,
    Justifier ENUM('ABSENCE', 'JUSTIFIÉ', 'NON JUSTIFIÉ') DEFAULT 'ABSENCE',
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE
);

CREATE TABLE active_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    group_id VARCHAR(50) NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE') DEFAULT 'PRESENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 7. Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('request', 'message', 'alert', 'success') DEFAULT 'message',
    category VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Discipline Tracking
CREATE TABLE suivieDisipline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    penalty_type ENUM('Blâme 1', 'Blâme 2', 'Blâme 3') NOT NULL,
    date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES stagiaires(NumInscription) ON DELETE CASCADE
);

-- --- SEEDING ---
-- (Admin: admin@ofppt.ma / admin123)
-- Using IGNORE to prevent duplicate errors since we didn't drop the DB
INSERT INTO admins (name, email, password) 
VALUES ('System Admin', 'admin@ofppt.ma', '$2a$10$vI8AAn.PyueTVUf4D6./juR3L6T/vT.hYj9f1.hS8GgJm.8G/5/mu')
ON DUPLICATE KEY UPDATE name='System Admin';
