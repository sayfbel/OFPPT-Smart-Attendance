-- OFPPT Attendance System - Neural Architecture Alpha
CREATE DATABASE IF NOT EXISTS ofppt_attendance;
USE ofppt_attendance;

-- 1. Classes Registry (The Clusters)
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    stream VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Central Neural Records)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'formateur', 'stagiaire') NOT NULL,
    class_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- 3. Class Supervisors (Junction for multiple formateurs per class)
CREATE TABLE IF NOT EXISTS class_supervisors (
    class_id VARCHAR(50),
    formateur_id INT,
    PRIMARY KEY (class_id, formateur_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Neural Node Timetable (The Matrix)
CREATE TABLE IF NOT EXISTS timetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(20) NOT NULL,
    time VARCHAR(50) NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    formateur_id INT,
    subject VARCHAR(255) NOT NULL,
    room VARCHAR(100) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Absence Reports (Manifests)
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_code VARCHAR(50) UNIQUE NOT NULL,
    formateur_id INT NOT NULL,
    class_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    salle VARCHAR(100),
    heure VARCHAR(100),
    status ENUM('JUSTIFIED', 'UNJUSTIFIED') DEFAULT 'UNJUSTIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Attendance Tracking (Neural Links)
CREATE TABLE IF NOT EXISTS report_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('PRESENT', 'ABSENT') NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --- SEEDING ---

-- Seed Admin (admin@ofppt.ma / admin123)
-- Hash generated for: admin123
INSERT INTO users (name, email, password, role) 
VALUES ('System Admin', 'admin@ofppt.ma', '$2a$10$vI8AAn.PyueTVUf4D6./juR3L6T/vT.hYj9f1.hS8GgJm.8G/5/mu', 'admin')
ON DUPLICATE KEY UPDATE name='System Admin';

-- Seed Base Classes
INSERT IGNORE INTO classes (id, title, stream) VALUES 
('DEV101', 'DEV101 - SQUADRON', 'Full Stack Web Dev'),
('DEV102', 'DEV102 - SQUADRON', 'Full Stack Web Dev'),
('ID101', 'ID101 - CLUSTER', 'Infrastructure Digitale');
