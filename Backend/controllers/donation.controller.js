const errorHandler = require("express-async-handler");
const Donation = require("../Models/donation.model");
const ReceiverRequest = require("../Models/request.model");
const Transaction = require("../Models/transaction.model");

const postDonation = errorHandler(async (req, res) => {
  const { foodItems, quantity, requestId, shelfLife, picture } = req.body;
  const user = req.user;
  const donorId = req.user._id;
  const donarName = user.name;
  const location = user.location;

  // Image validation (optional)
  // You can add checks for supported image formats and size limits

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
      picture: {
        data: Buffer.from(picture, 'base64'), // Assuming picture is sent as base64 string
        contentType: req.body.contentType || 'image/unknown', // Set default content type
      },
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
      picture: {
        data: Buffer.from(picture, 'base64'), // Assuming picture is sent as base64 string
        contentType: req.body.contentType || 'image/unknown', // Set default content type
      },
    });
  }

  const savedDonation = await newDonation.save();
  res.status(201).json(savedDonation);
});

const getDonation = errorHandler(async (req, res) => {
  const donations = await Donation.find();
  res.json(donations);
});

module.exports = {
  postDonation,
  getDonation,
};
