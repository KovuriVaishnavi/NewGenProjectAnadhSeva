const express = require("express");
const {
  postDonation,
  getDonation,
  getAllDonations,
  getAllRequests,
  getAllUsers,
} = require("../controllers/donation.controller");
const router = express.Router();

router.get("/", getDonation);

router.post("/", postDonation);
router.get("/donations", getAllDonations);
router.get("/requests", getAllRequests);
router.get("/users", getAllUsers);

module.exports = router;
