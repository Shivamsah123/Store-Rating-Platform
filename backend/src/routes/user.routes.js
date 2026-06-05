const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateChangePassword } = require('../validators/auth.validator');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

router.put('/change-password', authenticateJWT, validateChangePassword, authController.changePassword);

module.exports = router;
