const jwt = require('jsonwebtoken'); // Install this library using npm install jsonwebtoken
const User = require("../Models/user.model");
const { sendOtp, verifyOTP } = require('../contollers/otp.controller');
const { JWT_SECRET, JWT_EXPIRATION } = process.env; // Make sure these are defined in your .env file

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Send OTP to the user's email
    const otpRecord = await sendOtp({ email });

    // You can return the OTP record or a success message
    res.status(200).json({
      message: 'OTP sent to the email. Please verify to log in.',
      otpRecord,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
const verifyUserOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Verify OTP
    const isOtpValid = await verifyOTP({ email, otp });

    if (isOtpValid) {
      // Get the user details from the database
      const user = await User.findOne({ email });

      // Generate a JWT token for the user
      const token = jwt.sign(
        { email }, // Payload: include additional data if needed
        JWT_SECRET, // Secret key from environment variables
        { expiresIn: JWT_EXPIRATION || '1h' } // Token expiration time
      );

      // Respond with the token and user details
      res.status(200).json({
        message: 'OTP verified successfully. User logged in.',
        token,
        user: { // Send user details excluding sensitive information
          name: user.name,
          email: user.email,
          location: user.location,
          phone: user.phone,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};


module.exports = { loginUser, verifyUserOtp };
