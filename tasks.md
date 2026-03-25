# Project Tasks & Updates Checklist

## 🗄️ Database Changes & Refactoring

### 1. User & Authentication Refactor
- [x] **1. User Table Split**:
    - [x] Separate `users` table into `admins` and `formateurs`
    - [x] Update database schema and foreign keys (Reports, Timetable, etc.)
- [x] **2. Security & Profiles**:
    - [x] Remove unused `image` field from admin and formateur profiles
    - [x] Update auth logic to handle multi-table authentication

### 2. Formateur Management
- [x] **3. Formateur Type**:
    - [x] Add `type` (Parrain or Vacataire)
    - [x] Logic for Vacataire: manually enter email address
    - [x] Email suggestion: `(name)@ofppt-edu.ma` for vacataire

### 3. Classes Management
- [x] **4. Classes table**:
    - [x] replace `stream` by option 
    - [x] Add `année_scolaire`
    - [x] Add `level` (1er, 2eme, 3eme formation)
    - [x] Logic: recreate classes list each year (default no stagiaires, updated year)

### 4. Stagiaire (Student) Updates
- [x] **5. Stagiaire Refactor**:
    - [x] Rename `id` to `NumInscription`
    - [x] Remove `institu` 
    - [x] replace `year` by `Année` (1er, 2eme, 3eme formation)
    - [x] Add `filiéreId` (FK)
    - [x] Add `optionId` (FK to `options` table) - *only if year is 2ème or 3ème*
    - [x] Add `Active` (boolean):
        - *Logic: True if present last session OR absent and justified*

### 5. New Infrastructure Tables
- [x] **6. New Tables**:
    - [x] Table `filiére` (id, nom, niveau)
    - [x] Table `option` (id, filiéreId FK, nom, niveau)
- [x] **7. Salles (Rooms)**:
    - [x] Table `salles` (Id, nom)

### 6. Attendance & Reporting
- [x] **7. Report Table**: Add `sallID` (FK to `salles`)
- [x] **8. Repport_attendence Table**: Add `Justifier` (boolean)
