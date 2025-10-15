import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {isAuthenticated && user && (
        <div className="profile-container">
          <img 
            src="https://pifa.org.au/wp-content/uploads/2024/02/240219-JMelloy-for-profile-circle-transparent.png" 
            alt="Profile Photo" 
            className="profile-photo"
          />
          <div className="welcome-message">Welcome, {user.name}!</div>
        </div>
      )}
    </header>
  );
};

export default Header;
