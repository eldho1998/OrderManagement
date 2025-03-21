const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserControllers');

router.post('/signup', controller.signUpUser);
router.post('/login', controller.loginUser);
router.post('/logout', controller.logOut);

module.exports = router;
