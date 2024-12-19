const userModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const registerUser = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debug log

    const { name, email, phone, address, lat, long } = req.body;
    

    // Validate required fields
    if (!name || !email || !phone || !address || !lat || !long) {
      return res.status(400).json({ 
        msg: "Missing required fields",
        received: req.body 
      });
    }

    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Email already exists, please try again!" });
    }

    // Create user with properly structured data
    const user = await userModel.create({
      name,
      email,
      location: {
        name: address,    // Using address string as location name
        lat: Number(lat), // Ensure lat is a number
        long: Number(long) // Ensure long is a number
      },
      phone
    });
       
    // Generate token
    const token = jwt.sign(
      { 
        // userId: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION || '1h' }
    );

    res.status(201).json({ 
      msg: "User created successfully", 
      token 
    });

  } catch (error) {
    console.error('Registration error:', error); // Debug log
    res.status(500).json({ 
      msg: "Error creating user", 
      error: error.message,
      details: error.stack // Additional error details for debugging
    });
  }
};

module.exports = {
  registerUser
};