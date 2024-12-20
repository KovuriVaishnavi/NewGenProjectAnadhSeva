const userModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
// const registerUser = async (req, res) => {
//   try {
//     const existingUser = await userModel.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ msg: "Email already exists, please try again!" });
//     }
//     const user = await userModel.create({
//       name: req.body.name,
//       email: req.body.email,
//       location: {
//         name: req.body.address,
//         lat: req.body.lat,
//         long: req.body.long,
//       },
//       phone: req.body.phone,
//     });
//     res.status(201).json({ msg: "User created successfully", user: user });
//   } catch (error) {
//     res.status(500).json({ msg: "Error creating user", error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const user = await userModel.findOne({ email: email });
//     if (!user)
//       return res
//         .status(401)
//         .json({ message: "Invalid login credentials! Please check it." });

//     let payload = { user };
//     const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
//     res.status(200).json({
//       token,
//       user,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ msg: "user login unsuccessful", error: error.message });
//   }
// };
const registerUser = async (req, res) => {
  try {
    // Log the incoming request body to ensure all data is received
    console.log("Incoming registration data:", req.body);

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      console.log(`User with email ${req.body.email} already exists.`);
      return res
        .status(400)
        .json({ msg: "Email already exists, please try again!" });
    }

    // Log that we are proceeding with user creation
    console.log(`Creating user with email: ${req.body.email}`);
    
    // Create the new user
    const user = await userModel.create({
      name: req.body.name,
      email: req.body.email,
      location: {
        name: req.body.address,
        lat: req.body.lat,
        long: req.body.long,
      },
      phone: req.body.phone,
    });

    // Log user creation success
    console.log(`User created successfully: ${user._id}`);

    // Send successful response
    res.status(201).json({ msg: "User created successfully", user: user });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error during user registration:", error);

    // Send error response
    res.status(500).json({ msg: "Error creating user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Login request received for email:", req.body.email);

    const email = req.body.email;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      console.log("User not found with email:", email);
      return res
        .status(401)
        .json({ message: "Invalid login credentials! Please check it." });
    }

    console.log("User found:", user);

    let payload = { user };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("JWT token generated:", token);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ msg: "User login unsuccessful", error: error.message });
  }
};

module.exports = { registerUser, loginUser };

