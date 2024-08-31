const errorHandler = require("express-async-handler");
const Donation = require("../Models/donation.model");
const ReceiverRequest = require("../Models/request.model");
const Transaction = require("../Models/transaction.model");

const User = require("../Models/user.model");
const Request = require("../Models/request.model");
const path = require("path");
const postDonation = errorHandler(async (req, res) => {
  
  const { foodItems, quantity, requestId, shelfLife } = req.body;
  
  const user = req.user;
  const donorId = user._id;
  const donarName = user.name;
  const location = user.location;

  // Image validation (optional)
  // You can add checks for supported image formats and size limits
  let pictureUrl = null;
  

  // Check if a file was uploaded
  if (req.file) {
    // Construct the URL for the image
    pictureUrl = path.join('/images', req.file.filename); // Relative path to the image
    
  }


  let newDonation;

  if (requestId === 0) {
    // If no specific request is associated
    newDonation = new Donation({
      donorId,
      location,
      donarName,
      foodItems,
      quantity,
      shelfLife,
      misc: true,
      pictureUrl,
    });
  } else {
    // Handle the case where a specific request is associated with the donation
    const request = await ReceiverRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const receiverId = request.receiverId;
    const remainingQuantity = request.quantity;
    let status;

    if (quantity >= remainingQuantity) {
      // If donated quantity meets or exceeds the requested quantity
      status = "taken";
      await ReceiverRequest.findByIdAndUpdate(requestId, {
        status: "taken",
        quantity: 0, // Set the request's quantity to 0 (fulfilled)
      });
    } else {
      // If donated quantity is less than the requested quantity
      status = "pending";
      await ReceiverRequest.findByIdAndUpdate(requestId, {
        status: "pending",
        quantity: remainingQuantity - quantity, // Decrease the request's quantity
      });
    }

    newDonation = new Donation({
      donorId,
      location,
      donarName,
      foodItems,
      quantity,
      shelfLife,
      requestId,
      receiverId,
      status,
      pictureUrl,
    });
  }

  const savedDonation = await newDonation.save();

  if (requestId !== 0) {
    // Create a transaction record if the donation is associated with a request
    const request = await ReceiverRequest.findById(requestId);
    const transaction = new Transaction({
      dloc: location,
      rloc: request.location,
      donationId: savedDonation._id,
      donarName,
      requestId,
      receiverName: request.receiverName,
      donorId: donorId,
    });
    await transaction.save();
  }

  res.status(201).json(savedDonation);
});

const getDonation = errorHandler(async (req, res) => {
  const donations = await Donation.find();
  res.json(donations);
});



const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = {
  postDonation,
  getDonation,
  getAllDonations,
  getAllRequests,
  getAllUsers,
};
