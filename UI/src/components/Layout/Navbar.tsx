import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          TrustEze
        </Link>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/search" className="navbar-link" onClick={closeMobileMenu}>
            Search
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="navbar-link" onClick={closeMobileMenu}>
                Profile
              </Link>
              <div className="navbar-user">
                <span className="navbar-user-name">Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="navbar-link" onClick={closeMobileMenu}>
              Login
            </Link>
          )}
        </div>
        
        <div 
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
