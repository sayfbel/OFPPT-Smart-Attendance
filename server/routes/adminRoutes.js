const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

const { 
    getDashboardSummary, getClassesAndSchedule, createClass, updateClass, deleteClass, 
<<<<<<< HEAD
    getUsersByClass, createUser, 
    updateUser, deleteUser, getFormateurs, getReports, 
    getUsers, getClasses, getFilieres, 
    createFiliere, deleteFiliere,
    getAbsenceRegistry, justifyAbsence, addDisciplinePenalty, getDisciplineHistory
=======
    updateSchedule, createSchedule, deleteSchedule, getUsersByClass, createUser, 
    updateUser, deleteUser, getFormateurs, getReports, 
    getUsers, getClasses, getFilieres, getOptions, getTimetable,
    createFiliere, deleteFiliere, createOption, deleteOption 
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
} = require('../controllers/adminController');

// Admin only routes
router.get('/formateurs', protect, authorize('admin'), getFormateurs);
router.get('/summary', protect, authorize('admin'), getDashboardSummary);
router.get('/schedule', protect, authorize('admin'), getClassesAndSchedule);
<<<<<<< HEAD
router.get('/classes', protect, authorize('admin'), getClasses);
=======
router.get('/timetable', protect, authorize('admin'), getTimetable);
router.get('/classes', protect, authorize('admin'), getClasses);
router.post('/schedule', protect, authorize('admin'), createSchedule);
router.put('/schedule/:id', protect, authorize('admin'), updateSchedule);
router.delete('/schedule/:id', protect, authorize('admin'), deleteSchedule);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
router.post('/classes', protect, authorize('admin'), createClass);
router.put('/classes/:id', protect, authorize('admin'), updateClass);
router.delete('/classes/:id', protect, authorize('admin'), deleteClass);
router.get('/reports', protect, authorize('admin'), getReports);

router.get('/filieres', protect, authorize('admin'), getFilieres);
router.post('/filieres', protect, authorize('admin'), createFiliere);
router.delete('/filieres/:id', protect, authorize('admin'), deleteFiliere);

<<<<<<< HEAD
=======
router.get('/options', protect, authorize('admin'), getOptions);
router.post('/options', protect, authorize('admin'), createOption);
router.delete('/options/:id', protect, authorize('admin'), deleteOption);
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e

router.get('/users', protect, authorize('admin'), getUsers);
router.get('/users/by-class/:classId', protect, authorize('admin'), getUsersByClass);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

<<<<<<< HEAD
router.get('/absence-registry', protect, authorize('admin'), getAbsenceRegistry);
router.post('/justify-absence', protect, authorize('admin'), justifyAbsence);
router.post('/discipline', protect, authorize('admin'), addDisciplinePenalty);
router.get('/discipline/:stagiaireId', protect, authorize('admin'), getDisciplineHistory);

=======
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
module.exports = router;
