const express = require('express');
const router = express.Router();
const userRoutes = require('./UserRoutes');
//rest of all routes above..

router.use('/user', userRoutes);
//rest of all routes below..

module.exports = router;
