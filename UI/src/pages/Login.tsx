import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError, User } from '../store/slices/authSlice';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper function to get redirect path based on user role
  const getRedirectPath = (user: User | null): string => {
    if (!user || !user.roles || user.roles.length === 0) {
      return '/dashboard';
    }

    // Check roles in priority order: Investor > Buyer > Admin
    const roles = user.roles.map((r) => r.name?.toLowerCase());
    
    if (roles.includes('investor')) {
      return '/investor';
    } else if (roles.includes('buyer')) {
      return '/homebuyer';
    } else if (roles.includes('admin')) {
      // Admin can go to dashboard or investor (since admin has all roles)
      return '/investor';
    }
    
    return '/dashboard';
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRedirectPath(user);
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  // Update local error when Redux error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      // Success - redirect based on user role
      const user = result.payload.user;
      const redirectPath = getRedirectPath(user);
      navigate(redirectPath);
    } else if (loginUser.rejected.match(result)) {
      // Error is already set in Redux state, but we'll use it from the error state
      // The error will be displayed via the useEffect that watches the error state
    }
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
            {localError && (
              <div style={{ 
                color: '#f5576c', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {localError}
              </div>
            )}
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="login-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                className="login-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <br />
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
              style={{ 
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
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
 
