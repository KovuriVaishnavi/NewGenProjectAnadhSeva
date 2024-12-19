import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRegistration.css"; // Ensure this CSS file is imported for styling

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    organisationName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9004/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsOtpSent(true);
      } else {
        alert("Error sending OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending OTP");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9004/api/otpverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      if (response.ok) {
        navigate("/user-type-selection");
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error validating OTP");
    }
  };

  return (
    <div className="registration-form-container">
      {!isOtpSent ? (
        <form onSubmit={handleSubmit} className="registration-form">
          <h2>User Registration</h2>
          <label>
            Organisation Name / Name:
            <input
              type="text"
              placeholder="Enter Your Name"
              name="organisationName"
              value={formData.organisationName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              placeholder="Enter Your Mobile Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              placeholder="Enter Your Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Register</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="otp-form">
          <label>
            Enter OTP:
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit OTP</button>
        </form>
      )}
    </div>
  );
};

export default UserRegistration;
