# OFPPT Smart Attendance System 🎓

## 📖 Project Overview
The **OFPPT Smart Attendance System** is a modern, comprehensive digital solution designed to streamline attendance tracking and administrative management within OFPPT (Office de la Formation Professionnelle et de la Promotion du Travail) institutes. 

The primary purpose of this project is to replace traditional paper-based attendance methods with a fast, reliable, and automated system. It leverages modern web technologies and QR Code hardware integration to minimize administrative overhead for instructors (formateurs) and provide real-time visibility for the administration.

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Scripting:** Python (Used for generating and scanning QR codes).

---

## 👩‍💻 Guide: How to run locally

Follow these steps carefully to set up the project on your local machine.

### Prerequisites
Before you start, ensure you have the following installed on your system:
1. **Node.js:** v18 or higher (Download from [nodejs.org](https://nodejs.org/)).
2. **Python:** v3.8 or higher.
3. **MySQL:** XAMPP, WAMP, or standalone MySQL server.

### Step 1: Clone and Setup
1. Clone the repository to your local machine (if using Git):
   ```bash
   git clone <repository_url>
   cd OFPPT-Smart-Attendance
   ```

### Step 2: Database Initialization
1. Start your MySQL server (via XAMPP or service).
2. Create your database (e.g., `ofppt_attendance`).
3. Import the `server/ofppt_attendance.sql` file into your MySQL database to build the required tables and insert initial admin credentials.
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
