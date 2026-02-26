const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

const { getDashboardSummary, getClassesAndSchedule, createClass, updateClass, deleteClass, updateSchedule, createSchedule, getUsersByClass, createUser, updateUser, deleteUser, getFormateurs, getReports } = require('../controllers/adminController');

// Admin only routes
router.get('/formateurs', protect, authorize('admin'), getFormateurs);
router.get('/summary', protect, authorize('admin'), getDashboardSummary);
router.get('/schedule', protect, authorize('admin'), getClassesAndSchedule);
router.post('/schedule', protect, authorize('admin'), createSchedule);
router.put('/schedule/:id', protect, authorize('admin'), updateSchedule);
router.post('/classes', protect, authorize('admin'), createClass);
router.put('/classes/:id', protect, authorize('admin'), updateClass);
router.delete('/classes/:id', protect, authorize('admin'), deleteClass);
router.get('/reports', protect, authorize('admin'), getReports);

router.get('/users/by-class/:classId', protect, authorize('admin'), getUsersByClass);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
