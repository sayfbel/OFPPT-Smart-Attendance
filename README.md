# OFPPT Smart Attendance System 🎓

## 📖 Project Overview
The **OFPPT Smart Attendance System** is a modern, comprehensive digital solution designed to streamline attendance tracking and administrative management within OFPPT (Office de la Formation Professionnelle et de la Promotion du Travail) institutes. 

The primary purpose of this project is to replace traditional paper-based attendance methods with a fast, reliable, and automated system. It leverages modern web technologies and QR Code hardware integration to minimize administrative overhead for instructors (formateurs) and provide real-time visibility for the administration.

## ✨ Key Features & Functions

### 1. Unified Dashboard (Admin & Formateur)
- **Role-Based Access Control (RBAC):** Users are authenticated via JWT. The interface dynamically adapts based on whether the user is an `admin` or a `formateur`.
- **Live Notifications:** An integrated real-time notification engine alerts users of new class assignments, newly enrolled students, and system alerts.

### 2. User & Identity Management
- **Stagiaires (Students):** Detailed registry of students. When a student is created, a unique QR code is automatically generated via a Python script integration for fast physical scanning.
- **Formateurs (Instructors):** Instructors have their own profiles, schedules, and specific classes they supervise.
- **Admin Management:** Total control over the network's user base.

### 3. Timetable & Squadron Management
- **Clusters (Classes):** Groups of students are organized into classes (e.g., DEV101).
- **The Matrix (Timetable):** An intelligent scheduling system where admins can allocate rooms, subjects, and instructors to specific time slots.
- **Automatic Reminders:** Instructors receive automated system notifications reminding them of their sessions for the day.

### 4. Smart Check-in System (Neural Gateway)
- **QR Code Scanning:** Fast, secure check-ins via generated QR codes using integrated Python scripts.
- **Live Presence Matrix:** A real-time database table tracking students who are currently present in a specific session.
- **Digital Reports:** Instructors can review the live attendance, manually override if necessary, digitally sign, and submit the daily attendance report.

## 📊 Attendance Calculation Logic

The system uses a specific logic to determine **Absent** and **Present** states in the Admin Dashboard:

| State | Database Condition | Counting Logic |
| :--- | :--- | :--- |
| **ABSENT** 🔴 | `Justifier = 'ABSENCE'` | Total count of unjustified attendance records. |
| **PRÉSENT** 🟢 | Everything else | `(Theoretical Total Expected)` - `(ABSENT students)` |

### How it works:
- **Expected Attendance**: For every report generated, the system calculates the total number of students who **should** have been present (the full roster of that group).
- **Inclusion**: A student is counted as **PRESENT** if they were physically marked as `PRESENT` or `LATE`, or if they were absent but their record was marked as **`'JUSTIFIÉ'`** (Justified) by an administrator.
- **Unjustified Absence**: Only students whose record remains as **`'ABSENCE'`** (the default state) reduce the global presence rate.

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Scripting:** Python (Used for generating and scanning QR codes).

---

## 👩‍💻 Developer Guide: Getting Started

Welcome to the team! Follow these steps carefully to set up the project on your local machine.

### Prerequisites
Before you start, ensure you have the following installed on your system:
1. **Node.js:** v18 or higher (Download from [nodejs.org](https://nodejs.org/)).
2. **Python:** v3.8 or higher.
3. **MySQL:** XAMPP, WAMP, or standalone MySQL server.
4. **Git:** For version control.
5. **IDE:** Visual Studio Code (Recommended).

### Step 1: Clone and Setup
1. Clone the repository to your local machine (if using Git):
   ```bash
   git clone <repository_url>
   cd OFPPT-Smart-Attendance
   ```

### Step 2: Database Initialization
1. Start your MySQL server (via XAMPP or service).
2. Create your database (`ofppt_attendance`).
3. Import the `server/database.sql` file into your MySQL database to build the required tables and insert initial admin credentials. Alternatively, if you run the backend, `app.js` will attempt to build missing tables automatically!
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
You need to install packages for the backend, frontend, and the python scripts separately.

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

**Python Scripts (Required for QR core functionalities):**
```bash
pip install qrcode[pil] opencv-python pygrabber
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

The frontend will start at `http://localhost:5173` (depending on Vite configuration) and the backend at `http://localhost:5000`.

### Database Utility Scripts
The `/server` directory includes several utility scripts for database management and testing:

| Script | Purpose | When to use |
| :--- | :--- | :--- |
| `check_db_health.js` | Diagnostic tool | To verify table existence and record counts. |
| `check_db_status.js` | Schema verification | To check table structure (columns) of the `admins` table. |
| `re-init-db.js` | **Emergency Reset** | To wipe and rebuild the database using `database.sql`. |
| `test_query.js` | Logic testing | To debug the complex attendance `UNION` query. |
| `test_query2.js` | Query validator | To verify basic relationships between reports and attendance. |

Run these with `node server/<script_name>.js`.

---

## 🏗 Best Practices for Future Developers

To keep this project maintainable and clean, please adhere to the following guidelines:

### 1. Code Integration & Cleanliness
- **Component Modularity:** If a React component becomes larger than 300 lines, extract smaller parts (like Modals or specialized cards) into their own files inside `/components`.
- **CSS Management:** We use Tailwind CSS. Avoid writing custom CSS in `index.css` unless it's for global configurations (like `--primary` variables or `.dark` mode implementations). Use Tailwind utility classes directly on elements.
- **Error Handling:** On the backend, always wrap async route controllers in `try/catch` blocks. Return meaningful HTTP status codes (400 for bad input, 401 for auth issues, 500 for server crashes).

### 2. Project Organization
- `/client/src/pages`: For main layout pages (e.g., Dashboard.jsx, Timelines.jsx).
- `/client/src/components`: For reusable UI elements (e.g., NotificationPanel, Modals).
- `/server/controllers`: Business logic and database queries.
- `/server/routes`: Express router definitions mapping URLs to controllers.
- `/server/middlewares`: Validation and authentication logic (e.g., `authMiddleware.js`).

### 3. Git & GitHub Flow
- **Never push directly to `main`:** Always create a new branch for your feature or bug fix:
  ```bash
  git checkout -b feature/add-new-reporting
  ```
- **Commit Messages:** Write clear, descriptive commit messages. 
  - *Good:* `feat: add realtime notifications for formateurs`
  - *Bad:* `fixed stuff`
- **Pull Requests:** When your feature is done, push your branch and open a Pull Request (PR) on GitHub. Ask someone to review your code before merging.
- **Environment Variables:** NEVER commit `.env` files to GitHub. Ensure `.env` is listed in your `.gitignore` file. Provide a `.env.example` file so new developers know what variables are required.

### 4. Continuous Improvement
- **TypeScript:** Consider migrating the React frontend to TypeScript in the future to catch type errors during development.
- **State Management:** As the app grows, consider replacing excessive `useState` drilling with Redux Toolkit or Zustand for global state management.
- **API Documentation:** Use tools like Swagger or Postman Collections to document the backend API routes so frontend developers know exactly what endpoints are available.
