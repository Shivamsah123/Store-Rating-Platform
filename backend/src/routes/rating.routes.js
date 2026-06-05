const express = require('express');
const ratingController = require('../controllers/rating.controller');
const { validateSubmitRating, validateUpdateRating } = require('../validators/rating.validator');
const { authenticateJWT, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Only normal users can rate stores
router.use(authenticateJWT);
router.use(authorize('USER'));

router.post('/', validateSubmitRating, ratingController.submitRating);
router.put('/:storeId', validateUpdateRating, ratingController.updateRating);

module.exports = router;
