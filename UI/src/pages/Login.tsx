import React from 'react';
import './Login.css';

const Login: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Login button clicked');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <video className="login-video" autoPlay playsInline muted loop>
          <source src="https://trusteze.co/wp-content/uploads/2024/07/1437396-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="login-left-content" />
        <div className="login-overlay-bar">
          <p className="login-overlay-text">
            <a
              href="https://apc.freelandsystems.net/Home/About"
              style={{ textDecoration: 'none', color: '#6d6d6e' }}
              target="_blank"
              rel="noreferrer"
            >
              © Copyright, TrustKey Homes LLC, 2025. All rights reserved.&nbsp;|&nbsp;Version: 2.0.2.130
            </a>
          </p>
        </div>
      </div>
      <div className="login-right">
        <div className="login-container">
          <div className="login-logo">
            TRUSTKEYS
            <div className="subtitle">
              <span className="line"></span>
              <span className="subtitle-text">HOMES</span>
            </div>
          </div>
          <form id="login-form" onSubmit={handleSubmit}>
            <div>
              <input type="text" placeholder="Username" className="login-input" />
            </div>
            <div>
              <input type="password" placeholder="Password" className="login-input" />
            </div>
            <br />
            <button type="submit" className="login-button">Login</button>
            <br />
            <br />
          </form>
          <div>
            <a href="#forgot-username" className="forgot-link">Forgot Username</a>
            <span style={{ color: '#36444C', fontSize: '1.25rem', fontWeight: 'bold' }}>&nbsp;|&nbsp;</span>
            <a href="#forgot-password" className="forgot-link">Forgot Password</a>
          </div>
          <div className="social-media-section">
            <div className="disclaimer">
              <p style={{ color: '#6d6d6e' }}>
                Password/Login sharing is strictly prohibited. This system is monitored and reviewed for improper access or inappropriate use of client information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
 
