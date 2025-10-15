import React from 'react';
import { Link } from 'react-router-dom';
import './Temp.css';

const Temp: React.FC = () => {
  return (
    <div className="temp-container">
      <div className="temp-content">
        <h1>Welcome to TrustEze</h1>
        <p>Choose your dashboard to get started</p>
        
        <div className="dashboard-buttons">
          <Link to="/homebuyer" className="dashboard-button">
            Homebuyer Dashboard
          </Link>
          
          <Link to="/investor" className="dashboard-button">
            Investor Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Temp;
