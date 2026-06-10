# OFPPT Smart Attendance System 🎓

## 📖 Project Overview
The **OFPPT Smart Attendance System** is a modern, comprehensive digital solution designed to streamline attendance tracking and administrative management within OFPPT (Office de la Formation Professionnelle et de la Promotion du Travail) institutes.

The primary purpose of this project is to replace traditional paper-based attendance methods with a fast, reliable, and automated system. It features specialized login interfaces and workflows for both Admins and Formateurs (instructors), leveraging modern web technologies and QR Code hardware integration to minimize administrative overhead and provide real-time visibility for the administration.

## 👥 Team Member Contributions

This project was built collaboratively. Below is the breakdown of tasks handled by each team member:

### Moaad
- **Table Board:** Developed the core tables for data presentation and management.
- **Numbers Page:** Built the statistical overviews and numerical data dashboards.
- **Filters Page:** Implemented advanced filtering functionality to sort and search attendance data efficiently.
- **Classes Page:** Designed and built the interface for managing and viewing class details.

### Bilal
- **Group Page:** Created the interface for handling student groups.
- **Report Page:** Developed the comprehensive reporting module for attendance records.
- **Registering Absence:** Implemented the core logic and UI for marking and tracking student absences.
- **Profile Page:** Built the user profile pages for personalized settings and details.

### Saif
- **Admin Pages:** Spearheaded the creation of all administrative dashboards and management pages.
- **QR Scanning Integration:** Implemented the hardware/software integration for automated attendance via QR code scanning.
- **Building Features:** Developed architectural and core system features to ensure scalability and robustness.

## 🛠 Tech Stack & Functionality Overview

The application utilizes a robust modern technology stack to handle both the admin and formateur workflows efficiently.

- **Frontend:** Built with **React.js** and **Vite** for a fast, responsive user interface. Styled using **Tailwind CSS** and **Lucide Icons** for a modern, clean design. State management and routing are handled via core React ecosystem tools and **react-router-dom**.
- **Backend:** Powered by **Node.js** and **Express.js**, providing secure and scalable RESTful APIs. Authentication is secured using JWT.
- **Database:** Relational data is managed using **MySQL**, ensuring data integrity for users, classes, and attendance logs.
- **Special Integrations:** 
  - **html5-qrcode** for frontend QR scanning capabilities.
  - Custom file processing using **multer** and **xlsx** for data import/export.

---

## 👩‍💻 Project Setup Instructions

Follow these steps carefully to set up the project on your local machine.

### Prerequisites
Before you start, ensure you have the following installed on your system:
1. **Node.js:** v18 or higher (Download from [nodejs.org](https://nodejs.org/)).
2. **MySQL:** XAMPP, WAMP, or standalone MySQL server.

### Step 1: Clone and Setup
Clone the repository to your local machine:
```bash
git clone <repository_url>
cd OFPPT-Smart-Attendance
```

### Step 2: Database Initialization
1. Start your MySQL server.
2. Create your database (e.g., `ofppt_attendance`).
3. Import the required `.sql` schema (e.g., `server/ofppt_attendance.sql` if available) into your MySQL database to build the tables and insert initial credentials.
4. Navigate to the server folder and configure your environment variables:
   - Create a `.env` file in the `/server` directory:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=ofppt_attendance
     JWT_SECRET=supersecretkey123
     ```

### Step 3: Install Dependencies
You need to install packages for the backend and frontend separately.

**Backend (`/server`):**
```bash
cd server
npm install
```

**Frontend (`/client`):**
```bash
cd ../client
npm install
```

### Step 4: Run the Application
You will need two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The frontend will start at `http://localhost:5173` (depending on Vite configuration) and the backend at `http://localhost:5000`. You can then log in using the respective Admin or Formateur credentials.
