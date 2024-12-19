import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./RequestForm.css"; // Import the CSS file

const RequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverId: "",
    loc: { name: "", lat: 0, long: 0 },
    foodItems: [],
    quantity: 0,
    status: "open",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "foodItems") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    if (submitted) {
      setFormData({
        receiverName: "",
        receiverId: "",
        loc: { name: "", lat: 0, long: 0 },
        foodItems: [],
        quantity: 0,
        status: "open",
      });
      setSubmitted(false); // Reset submitted state
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        // Ensure receiverId and receiverName are set dynamically from logged-in user
        const response = await axios.post(
          "http://localhost:9004/api/request",
          {
            ...formData,
            receiverId: user._id,
            receiverName: user.name,
            loc: user.location || { name: "Unknown", lat: 0, long: 0 },
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log("Request submitted successfully", response.data);
        toast.success(
          "Your request has been submitted successfully! 🌟 Your generous request is now being processed. Thank you for your patience and support!"
        );
        setSubmitted(true); // Trigger useEffect to reset form and close modal

        // Redirect to homepage
        navigate('/');
      } else {
        toast.error("User not found. Please log in.");
      }
    } catch (error) {
      console.error("Error submitting request", error);
      toast.error(error.response?.data?.message || "Error submitting request");
      setSubmitted(true);
    }
  };

  return (
    <div>
      <div className="request-form-container">
        <h2>Submit a Request</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Food Items:
            <input
              type="text"
              name="foodItems"
              value={formData.foodItems.join(", ")}
              onChange={handleChange}
              placeholder="Please enter food items required (separated by comma)"
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Please enter quantity"
              required
            />
          </label>
          <input type="submit" className="btn btn-success" />
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
