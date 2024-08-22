import React, { useState, useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { Modal, Button } from 'react-bootstrap';
import './styles/Home.css';
import img3 from './images/about1.png'; // Ensure you have this image in the specified path
import missionImg from './images/donation.jpg'; // Update with the correct path

import Footer from './Footer'; // Import the Footer component

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const StatsSection = () => {
    const counters = useRef([]);

    useEffect(() => {
      const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const endValue = parseInt(target.getAttribute('data-target'), 10);
            const countUp = new CountUp(target, endValue, {
              duration: 2,
              useEasing: true,
              useGrouping: true,
              separator: ',',
            });
            countUp.start();
            observer.unobserve(target);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 1.0
      });

      counters.current.forEach(counter => {
        if (counter) {
          observer.observe(counter);
        }
      });

      // Cleanup observer on unmount
      return () => {
        counters.current.forEach(counter => {
          if (counter) {
            observer.unobserve(counter);
          }
        });
      };
    }, []);

    return (
      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number" data-target="5538" ref={el => counters.current[0] = el}>0</span>
          <span className="stat-label">Donation</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="71" ref={el => counters.current[1] = el}>0</span>
          <span className="stat-label">Fund Raised</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="227" ref={el => counters.current[2] = el}>0</span>
          <span className="stat-label">Donation</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" data-target="227" ref={el => counters.current[3] = el}>0</span>
          <span className="stat-label">Donation</span>
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Our Helping To The World.</h1>
          <p>Join us in our mission to fight hunger and provide nutritious food to those in need. Your support helps us make a real difference in the lives of countless individuals and families.</p>
          <div className="hero-actions">
            <button className="donate-button" onClick={handleShow}>Donate</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={missionImg} alt="Helping Hands" />
        </div>
      </div>

      <section className="services">
        <h2>Help The Helpless</h2>
        <div className="service-cards">
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3>Volunteers</h3>
            <p>Our volunteers are the backbone of our organization. Join us to make a difference in the community.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-donate"></i>
            </div>
            <h3>Donors</h3>
            <p>Generous donors provide the necessary resources to keep our mission alive and thriving.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>Recipients</h3>
            <p>We support recipients by providing essential food items and resources to help them in times of need.</p>
          </div>
        </div>
      </section>

      <section className="foundation" id='foundation'>
        <div className="foundation-content">
          <div className="foundation-text">
            <h2>About Our Foundation</h2>
            <h3>We Are In A Mission To Help The Helpless</h3>
            <p>Our foundation is dedicated to fighting hunger and providing support to those in need. We believe in ensuring that no one goes hungry and everyone has access to healthy and nutritious food.</p>
            <p>Join us in our mission to make a difference in the lives of the helpless. Together, we can provide food and hope to those who need it most.</p>
            <button>Learn More</button>
          </div>
          <div className="foundation-images">
            <img src={img3} alt="Foundation" />
          </div>
        </div>
      </section>

      <section className="call-to-action">
        <h2>Let's Change the World With Humanity</h2>
        <button>Become a Volunteer</button>
      </section>

      <StatsSection />

      <Footer />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Donate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Donation Amount</label>
              <input type="number" className="form-control" id="amount" placeholder="Enter donation amount" />
            </div>
            <label htmlFor="message">Message</label>
              <textarea className="form-control" id="message" rows="3" placeholder="Enter a message"></textarea>
            
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
