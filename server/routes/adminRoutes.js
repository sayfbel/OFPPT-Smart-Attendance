const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

const { 
    getDashboardSummary, getClassesAndSchedule, createClass, updateClass, deleteClass, 
    getUsersByClass, createUser, 
    updateUser, deleteUser, getFormateurs, getReports, 
    getUsers, getClasses, getFilieres, 
    createFiliere, deleteFiliere,
    getAbsenceRegistry, justifyAbsence, addDisciplinePenalty, getDisciplineHistory
} = require('../controllers/adminController');

// Admin only routes
router.get('/formateurs', protect, authorize('admin'), getFormateurs);
router.get('/summary', protect, authorize('admin'), getDashboardSummary);
router.get('/schedule', protect, authorize('admin'), getClassesAndSchedule);
router.get('/classes', protect, authorize('admin'), getClasses);
router.post('/classes', protect, authorize('admin'), createClass);
router.put('/classes/:id', protect, authorize('admin'), updateClass);
router.delete('/classes/:id', protect, authorize('admin'), deleteClass);
router.get('/reports', protect, authorize('admin'), getReports);

router.get('/filieres', protect, authorize('admin'), getFilieres);
router.post('/filieres', protect, authorize('admin'), createFiliere);
router.delete('/filieres/:id', protect, authorize('admin'), deleteFiliere);


router.get('/users', protect, authorize('admin'), getUsers);
router.get('/users/by-class/:classId', protect, authorize('admin'), getUsersByClass);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

router.get('/absence-registry', protect, authorize('admin'), getAbsenceRegistry);
router.post('/justify-absence', protect, authorize('admin'), justifyAbsence);
router.post('/discipline', protect, authorize('admin'), addDisciplinePenalty);
router.get('/discipline/:stagiaireId', protect, authorize('admin'), getDisciplineHistory);

module.exports = router;
