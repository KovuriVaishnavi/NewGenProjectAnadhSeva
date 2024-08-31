const express = require("express");
const multer = require("multer"); // Import multer
const path = require("path"); // Import path for handling file paths
const {
  postDonation,
  getDonation
} = require("../controllers/donation.controller");
const router = express.Router();

// Setup Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images')); // Specify the folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename with extension
  },
});

const upload = multer({ storage: storage });

router.get("/", getDonation);
router.post("/", upload.single('picture'), postDonation);

module.exports = router;
