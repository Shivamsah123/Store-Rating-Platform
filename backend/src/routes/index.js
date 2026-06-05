const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const storeRoutes = require('./store.routes');
const ratingRoutes = require('./rating.routes');
const storeOwnerRoutes = require('./storeOwner.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/store-owner', storeOwnerRoutes);

module.exports = router;
