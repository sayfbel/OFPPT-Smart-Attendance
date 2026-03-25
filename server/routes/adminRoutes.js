const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

const { 
    getDashboardSummary, getClassesAndSchedule, createClass, updateClass, deleteClass, 
    updateSchedule, createSchedule, deleteSchedule, getUsersByClass, 
    createUser, updateUser, deleteUser, getFormateurs, getReports,
    recreateClassesForNewYear 
} = require('../controllers/adminController');

router.post('/classes/transition', protect, authorize('admin'), recreateClassesForNewYear);

// Admin only routes
router.get('/formateurs', protect, authorize('admin'), getFormateurs);
router.get('/summary', protect, authorize('admin'), getDashboardSummary);
router.get('/schedule', protect, authorize('admin'), getClassesAndSchedule);
router.post('/schedule', protect, authorize('admin'), createSchedule);
router.put('/schedule/:id', protect, authorize('admin'), updateSchedule);
router.delete('/schedule/:id', protect, authorize('admin'), deleteSchedule);
router.post('/classes', protect, authorize('admin'), createClass);
router.put('/classes/:id', protect, authorize('admin'), updateClass);
router.delete('/classes/:id', protect, authorize('admin'), deleteClass);
router.get('/reports', protect, authorize('admin'), getReports);

router.get('/users/by-class/:classId', protect, authorize('admin'), getUsersByClass);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Infrastructure Management
const { getFilieres, createFiliere, deleteFiliere, getOptions, createOption, deleteOption, getSalles, createSalle, deleteSalle } = require('../controllers/adminController');

router.get('/filieres', protect, authorize('admin'), getFilieres);
router.post('/filieres', protect, authorize('admin'), createFiliere);
router.delete('/filieres/:id', protect, authorize('admin'), deleteFiliere);

router.get('/options', protect, authorize('admin'), getOptions);
router.post('/options', protect, authorize('admin'), createOption);
router.delete('/options/:id', protect, authorize('admin'), deleteOption);

router.get('/salles', protect, authorize('admin'), getSalles);
router.post('/salles', protect, authorize('admin'), createSalle);
router.delete('/salles/:id', protect, authorize('admin'), deleteSalle);

module.exports = router;
