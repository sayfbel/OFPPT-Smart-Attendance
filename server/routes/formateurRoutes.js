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
    clearCheckins,
    getProfile,
    updateProfile
} = require('../controllers/formateurController');

// All protected for Formateur
router.get('/profile', protect, authorize('formateur'), getProfile);
router.put('/profile', protect, authorize('formateur'), updateProfile);
router.post('/submit-report', protect, authorize('formateur'), submitReport);
router.get('/schedule', protect, authorize('formateur'), getSchedule);
router.get('/users/by-class/:classId', protect, authorize('formateur'), getUsersByClass);
router.post('/process-checkin', protect, authorize('formateur'), processCheckin);
router.get('/active-checkins/:classId', protect, authorize('formateur'), getActiveCheckins);
router.post('/clear-checkins', protect, authorize('formateur'), clearCheckins);
router.get('/all-students-faceids', protect, authorize('formateur'), require('../controllers/formateurController').getAllStudentsFaceIds);

module.exports = router;
