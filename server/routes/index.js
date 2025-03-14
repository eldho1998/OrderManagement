const express = require('express');
const router = express.Router();
const userRoutes = require('./UserRoutes');
const oredrRoutes = require('./OrderRoutes');
const productRoutes = require('./ProductRoutes');

router.use('/user', userRoutes);
router.use('/order', oredrRoutes);
router.use('/product', productRoutes);

module.exports = router;
