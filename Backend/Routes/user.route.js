// const express = require('express');
// const { loginUser, verifyUserOtp } = require('../controllers/user.controller'); // Adjust path as per your file structure

// const router = express.Router();

// // Route to handle login and send OTP to the provided email
// router.post('/login', loginUser);

// // Route to verify OTP
// router.post('/verify-otp', verifyUserOtp);

// module.exports = router;
const express = require("express");
const {
  loginUser,
  registerUser
} = require("../controllers/user.controller");
const router = express.Router();

// Admin Routes
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;