const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

// Formateur only routes
const {
    submitReport,
    getSchedule,
    getUsersByClass,
    processCheckin,
    processCheckinByQR,
    getActiveCheckins,
    clearCheckins,
    getProfile,
    updateProfile,
    startExternalScanner,
    stopExternalScanner,
    updateCheckinStatus
} = require('../controllers/formateurController');

// All protected for Formateur
router.get('/profile', protect, authorize('formateur'), getProfile);
router.put('/profile', protect, authorize('formateur'), updateProfile);
router.post('/submit-report', protect, authorize('formateur'), submitReport);
router.get('/schedule', protect, authorize('formateur'), getSchedule);
router.get('/users/by-class/:classId', protect, authorize('formateur'), getUsersByClass);
router.post('/process-checkin', protect, authorize('formateur'), processCheckin);
router.post('/process-checkin-qr', protect, authorize('formateur'), processCheckinByQR);
router.get('/active-checkins/:classId', protect, authorize('formateur'), getActiveCheckins);
router.post('/clear-checkins', protect, authorize('formateur'), clearCheckins);
router.post('/update-checkin-status', protect, authorize('formateur'), updateCheckinStatus);


// Python Scanner Bridge Control
router.post('/start-external-scanner', protect, authorize('formateur'), startExternalScanner);
router.post('/stop-external-scanner', protect, authorize('formateur'), stopExternalScanner);

<<<<<<< HEAD
// Profile and Security
const { updateFormateurProfile, updatePassword, forceUpdatePassword } = require('../controllers/formateurController');
router.put('/update-profile', protect, authorize('formateur'), updateFormateurProfile);
router.put('/update-password', protect, authorize('formateur'), updatePassword);
router.put('/force-update-password', protect, authorize('formateur'), forceUpdatePassword);

=======
>>>>>>> 6a6ba9556e523366f663093f32ea6fa7de4f575e
module.exports = router;
