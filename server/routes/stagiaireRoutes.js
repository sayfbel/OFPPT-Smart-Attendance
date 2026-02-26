const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getProfile, getSchedule, getAbsences, updateProfile } = require('../controllers/stagiaireController');

// All stagiaire routes protected
router.get('/profile', protect, authorize('stagiaire'), getProfile);
router.put('/profile', protect, authorize('stagiaire'), updateProfile);
router.get('/schedule', protect, authorize('stagiaire'), getSchedule);
router.get('/absences', protect, authorize('stagiaire'), getAbsences);

module.exports = router;
