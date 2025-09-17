import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TrustEze</h3>
            <p>Your trusted partner in finding the perfect home. We make the home buying process simple, transparent, and secure.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/search">Search Properties</a></li>
              <li><a href="/profile">My Profile</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📧 info@trusteze.com</p>
            <p>📞 (555) 123-4567</p>
            <p>📍 123 Real Estate Ave, City, State 12345</p>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 TrustEze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
