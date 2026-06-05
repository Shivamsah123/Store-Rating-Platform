const express = require('express');
const adminController = require('../controllers/admin.controller');
const { validateCreateUser, validateCreateStore } = require('../validators/admin.validator');
const { authenticateJWT, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticateJWT);
router.use(authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', validateCreateUser, adminController.createUser);
router.post('/stores', validateCreateStore, adminController.createStore);
router.get('/users', adminController.getUsers);
router.get('/stores', adminController.getStores);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/stores/:id/status', adminController.toggleStoreStatus);
router.delete('/stores/:id', adminController.deleteStore);
router.get('/ratings', adminController.getRatings);
router.get('/global-search', adminController.globalSearch);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
