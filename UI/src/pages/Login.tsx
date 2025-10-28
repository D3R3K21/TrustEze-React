import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    <div className="left">
      <video className="video-background" autoPlay playsInline muted loop>
        <source src="https://trusteze.co/wp-content/uploads/2024/07/1437396-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="left-content">
        {/* Content for left side */}
      </div>
      <div className="overlay-bar">
        <p className="overlay-text">
          <a 
            href="https://apc.freelandsystems.net/Home/About" 
            style={{ textDecoration: 'none', color: '#6d6d6e' }} 
            target="_blank" 
            rel="noreferrer"
          >
            © Copyright, TrustKey Homes LLC, 2024. All rights reserved.&nbsp;|&nbsp;Version: 2.0.2.130
          </a>
        </p>
      </div>
    </div>
    <div className="right">
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
            <input 
              type="text" 
              placeholder="demo@trusteze.com" 
              className="login-input" 
              style={{ color: '#fff' }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="password" 
              className="login-input" 
              style={{ color: '#fff' }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <br />
          <button type="submit" className="login-button">Login</button>
          <br /><br />
        </form>
        <div>
          <Link to="/forgot-username" className="forgot-link">
            Forgot Username
          </Link>
          <span style={{ color: '#36444C', fontSize: '20px', fontWeight: 'bold' }}>
            &nbsp;|&nbsp;
          </span>
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password
          </Link>
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
