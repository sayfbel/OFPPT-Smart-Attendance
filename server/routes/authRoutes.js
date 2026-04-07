const express = require('express');
const router = express.Router();
const { login, getMe, updateProfile, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);

module.exports = router;
