const express= require('express');

const router= express.Router();

const {registerUser, loginUser, verifyOTP} = require("../controllers/authController")

//register route
router.post('/register', registerUser);

//login route
router.post('/login', loginUser);

//verify OTP
router.post('/verify-otp', verifyOTP);





module.exports= router;
