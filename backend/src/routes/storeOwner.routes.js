const express = require('express');
const storeOwnerController = require('../controllers/storeOwner.controller');
const { authenticateJWT, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateJWT);
router.use(authorize('STORE_OWNER'));

router.get('/dashboard', storeOwnerController.getDashboard);
router.get('/ratings', storeOwnerController.getRatings);
router.get('/stores', storeOwnerController.getStores);

module.exports = router;
