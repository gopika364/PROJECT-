const user = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.get('/',user.home);
router.get('/login',user.login);
router.get('/register',user.register);
router.get('/otp',user.otp);
router.get('/forgotPassword',user.forgotPassword);

router.post('/otp',user.postOtp);




module.exports = router;