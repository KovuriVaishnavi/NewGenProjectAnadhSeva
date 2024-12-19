const Otp = require('../models/otp.model');
const generateOtp = require('../utils/generateOtp');
const {sendEmail} = require('../utils/sendEmail');
const { hashData, verifyHashedData } = require('../utils/hashData');
const validator = require('validator'); // You might need to install it with npm install validator
const jwt = require('jsonwebtoken'); // Install with npm install jsonwebtoken

const JWT_SECRET = "Annadseva"
const JWT_EXPIRATION_TIME= "2h";

const { AUTH_EMAIL } = process.env;
 
const sendOtp = async ({ email }) => {
  try {
    if (!email || !validator.isEmail(email)) {
      throw new Error("Invalid email address provided");
    }

    await Otp.deleteOne({ email });

    const generatedOtp = await generateOtp();

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: "OTP for login",
      html: `<h1>OTP for login</h1><p>${generatedOtp}</p>
      <p>OTP expires in 10 minutes</p>`
    };

    await sendEmail(mailOptions);
    const hashedOtp = await hashData(generatedOtp);
    const newOtp = new Otp({
      email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    });

    const createdOtpRecord = await newOtp.save();
    return createdOtpRecord;
  } catch (err) {
    console.error(err); // Log the error details
    throw new Error(err.message);
  }
};


const verifyOTP = async ({ email, otp }) => {
  try {
    if (!(email && otp)) {
      throw Error("Provide values for email and otp");
    }

    // Find the OTP record by email
    const matchedOTPRecord = await Otp.findOne({ email });

    if (!matchedOTPRecord) {
      throw Error("No OTP record found");
    }

    const { expiresAt, otp: hashedOtp } = matchedOTPRecord;

    // Check if OTP has expired
    if (expiresAt < Date.now()) {
      throw Error("OTP expired");
    }

    // Verify the provided OTP matches the hashed one
    const validOTP = await verifyHashedData(otp, hashedOtp);

    if (!validOTP) {
      throw Error("Invalid OTP");
    }

    // Generate a JWT token upon successful OTP verification
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME || '1h' });

    // Return the token
    return { token, message: "OTP verified successfully" };
  } catch (error) {
    console.error(error); // Log the error details
    throw new Error("Verification unsuccessful");
  }
};

const deleteOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = await Otp.findOneAndDelete({ email });

    if (!otp) {
      throw new Error("OTP not found");
    }

    res.status(200).json({ message: "OTP deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { sendOtp, verifyOTP,deleteOtp };
