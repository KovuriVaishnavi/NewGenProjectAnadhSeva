const express = require('express');
const { verifyOTP } = require('../contollers/otp.controller');
const userschema = require("../Models/user.model")
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOTP = await verifyOTP({ email, otp });
    if (validOTP) {
       
    }
    res.status(200).json({ valid: validOTP });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
