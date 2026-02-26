const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

// Formateur only routes
const {
    submitReport,
    getSchedule,
    getUsersByClass,
    processCheckin,
    getActiveCheckins,
    clearCheckins
} = require('../controllers/formateurController');

// All protected for Formateur
router.post('/submit-report', protect, authorize('formateur'), submitReport);
router.get('/schedule', protect, authorize('formateur'), getSchedule);
router.get('/users/by-class/:classId', protect, authorize('formateur'), getUsersByClass);
router.post('/process-checkin', protect, authorize('formateur'), processCheckin);
router.get('/active-checkins/:classId', protect, authorize('formateur'), getActiveCheckins);
router.post('/clear-checkins', protect, authorize('formateur'), clearCheckins);

module.exports = router;
