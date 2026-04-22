const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

const { 
    getDashboardSummary, getUsersByGroup, createGroup, updateGroup, deleteGroup, 
    getFormateurs, getReports, 
    getUsers, getGroups, getFilieres,
    createFiliere, deleteFiliere, updateFiliere,
    getSalles, createSalle, updateSalle, deleteSalle,
    getAbsenceRegistry, justifyAbsence, addDisciplinePenalty, getDisciplineHistory,
    createUser, updateUser, deleteUser, getStudentDetails
} = require('../controllers/adminController');

// Admin only routes
router.get('/formateurs', protect, authorize('admin'), getFormateurs);
router.get('/summary', protect, authorize('admin'), getDashboardSummary);
router.get('/groups', protect, authorize('admin'), getGroups);
router.post('/groups', protect, authorize('admin'), createGroup);
router.put('/groups/:id', protect, authorize('admin'), updateGroup);
router.delete('/groups/:id', protect, authorize('admin'), deleteGroup);
router.get('/reports', protect, authorize('admin'), getReports);

router.get('/filieres', protect, authorize('admin'), getFilieres);
router.post('/filieres', protect, authorize('admin'), createFiliere);
router.put('/filieres/:id', protect, authorize('admin'), updateFiliere);
router.delete('/filieres/:id', protect, authorize('admin'), deleteFiliere);

router.get('/salles', protect, authorize('admin'), getSalles);
router.post('/salles', protect, authorize('admin'), createSalle);
router.put('/salles/:id', protect, authorize('admin'), updateSalle);
router.delete('/salles/:id', protect, authorize('admin'), deleteSalle);

router.get('/users', protect, authorize('admin'), getUsers);
router.get('/users/by-group/:groupId', protect, authorize('admin'), getUsersByGroup);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

router.get('/absence-registry', protect, authorize('admin'), getAbsenceRegistry);
router.post('/justify-absence', protect, authorize('admin'), justifyAbsence);
router.post('/discipline', protect, authorize('admin'), addDisciplinePenalty);
router.get('/discipline/:stagiaireId', protect, authorize('admin'), getDisciplineHistory);
router.get('/students/:id', protect, authorize('admin', 'formateur'), getStudentDetails);
module.exports = router;
