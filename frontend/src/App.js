import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Aboutus from './components/Aboutus';
import AdminDashboard from './components/Admindashboard';
import Contact from './components/Contact';
import Donation from "./components/Donation/Donation";
import Header from './components/Header';
import Home from './components/Home';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Log from './components/Logs/log';
import DonorProfile from './components/Profiles/DonorProfile';
import RecieverProfile from './components/Profiles/RecieverProfile';
import VolunteerProfile from './components/Profiles/VolunteerProfile';
import RequestForm from './components/RequestForm/RequestForm';
import UserRegistration from './components/userRegistration';
import UserTypeSelection from './components/UserTypeSelection';
import VolunteerActiveRequests from './components/VolunteerDashboard';
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user-type-selection" element={<UserTypeSelection />} />
          <Route path="/volunteer" element={<VolunteerActiveRequests />} />
          <Route path="/donate" element={<Donation />} />
          <Route path="/request" element={<RequestForm />} />
          <Route path="/log" element={<Log />} />
          <Route path="/donorprofile" element={<DonorProfile />} />
          <Route path="/recieverprofile" element={<RecieverProfile />} />
          <Route path="/volunteerprofile" element={<VolunteerProfile />} />
        </Routes>
        <ToastContainer /> {/* Add ToastContainer here */}
      </div>
    </BrowserRouter>
  );
}

export default App;