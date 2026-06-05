const express = require('express');
const storeController = require('../controllers/store.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// Viewing stores requires authentication to determine the current user's rating
router.get('/', authenticateJWT, storeController.getStores);
router.get('/:storeId/reviews', authenticateJWT, storeController.getStoreReviews);

module.exports = router;
