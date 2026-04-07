const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

// Formateur only routes
const {
    submitReport,
    getGroups,
    getUsersByGroup,
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
router.get('/groups', protect, authorize('formateur'), getGroups);

router.get('/users/by-group/:groupId', protect, authorize('formateur'), getUsersByGroup);
router.post('/process-checkin', protect, authorize('formateur'), processCheckin);
router.post('/process-checkin-qr', protect, authorize('formateur'), processCheckinByQR);
router.get('/active-checkins/:groupId', protect, authorize('formateur'), getActiveCheckins);
router.post('/clear-checkins', protect, authorize('formateur'), clearCheckins);
router.post('/update-checkin-status', protect, authorize('formateur'), updateCheckinStatus);


// Python Scanner Bridge Control
router.post('/start-external-scanner', protect, authorize('formateur'), startExternalScanner);
router.post('/stop-external-scanner', protect, authorize('formateur'), stopExternalScanner);

// Profile and Security
const { updateFormateurProfile, updatePassword, forceUpdatePassword } = require('../controllers/formateurController');
router.put('/update-profile', protect, authorize('formateur'), updateFormateurProfile);
router.put('/update-password', protect, authorize('formateur'), updatePassword);
router.put('/force-update-password', protect, authorize('formateur'), forceUpdatePassword);
module.exports = router;
