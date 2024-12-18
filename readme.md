
# Project Name: ANADH SEVA - Food Donation Platform

## Description

ANADH SEVA is a food donation platform connecting donors, recipients, and volunteers. The goal of the platform is to facilitate efficient distribution of food donations to those in need, such as old age homes and other organizations, while involving volunteers in the process.

## Key Features

- *Donor Registration and Login:* Donors can sign up and log in to the platform to make food donations.
- *Recipient Requests:* Recipients can request food donations and track available resources.
- *Volunteer Management:* Volunteers can view and sign up for tasks related to food distribution.
- *Admin Dashboard:* Administrators can manage inventory, track donations, approve assistance requests, and generate reports.
- *OTP-based Login:* Secure user authentication using OTP verification.
- *Real-time Map Component:* A map interface using React-Leaflet for donor-recipient matching.
- *Responsive Design:* The platform is fully responsive across various devices.

## Technologies Used

- *Frontend:* React.js, React-Bootstrap, React-Leaflet
- *Backend:* Node.js, Express.js, MongoDB
- *Styling:* Bootstrap, CSS
- *Other Libraries:* Axios, Multer, React Icons

## Installation

1. *Clone the repository:*

   bash
   git clone https://github.com/KovuriVaishnavi/Annseva.git
   

2. *Install dependencies for both frontend and backend:*

   Navigate to the frontend and backend directories separately and run:

   bash
   npm install
   

3. *Set up environment variables:*

   Create a .env file in the backend directory and add your environment variables like:

   env
   JWT_SECRET=your_jwt_secret
   MONGO_URI=mongodb://localhost:27017/anadhseva
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_password
   

4. *Run the development server:*

   - For frontend:

     bash
     npm start
     

   - For backend:

     bash
     nodemon index.js
     

5. *Access the application:*

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

- *Donors:* Can donate food and view their donation history.
- *Recipients:* Can request food and schedule pickups or deliveries.
- *Volunteers:* Can sign up to help with the distribution of food.
- *Admins:* Can manage users, donations, and generate reports on food distribution.

## Dependencies

- Node.js
- MongoDB
- Axios
- React.js
- Multer
- Bootstrap
- React-Leaflet

## Motivation

This project was created to address the growing issue of food waste while simultaneously helping organizations in need, such as old age homes. The platform seeks to streamline food donations and make the process efficient and transparent.

## Contact

For any inquiries or support, please reach out to the developer:

- *Email:* gresh0121@gmail.com

---

*Note:* This project is still under development. Future updates will include AI-powered crop disease predictions and improved volunteer management features.
