# OFPPT Smart Attendance & Absence Management System

A production-ready full-stack attendance system using QR code technology.

## 🚀 Getting Started

### 1. Database Setup (MySQL/XAMPP)
- Open XAMPP Control Panel and start **Apache** and **MySQL**.
- Go to `http://localhost/phpmyadmin`.
- Create a new database named `ofppt_attendance`.
- Import the file `server/database.sql`.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will run on `http://localhost:3000`.

## 👥 Platforms & Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ofppt.ma` | `admin123` |
| **Formateur** | (Create via Admin) | - |
| **Stagiaire** | (Create via Admin) | - |

## ✨ Features
- **Door Scanner**: Full-screen camera interface for instant QR detection.
- **Role-Based Dashboards**: Customized views for Students, Teachers, and Admins.
- **Analytics**: Real-time attendance percentage and distribution charts.
- **Security**: JWT Authentication and Protected Routes.

## 🏗️ Project Structure
- `/server`: Express.js backend, JWT Auth, MySQL models.
- `/client`: React + Vite frontend, Glassmorphism UI, Recharts analytics.
