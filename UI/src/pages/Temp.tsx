import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/CommonComponents/Button';
import './Temp.css';

const Temp: React.FC = () => {
  const navigate = useNavigate();

  const handleHomebuyerClick = () => {
    navigate('/homebuyer');
  };

  const handleInvestorClick = () => {
    navigate('/investor');
  };

  return (
    <div className="temp-container">
      <div className="temp-content">
        <h1>Welcome to TrustEze</h1>
        <p>Choose your dashboard to get started</p>
        
        <div className="dashboard-buttons">
          <Button 
            name="Homebuyer Dashboard" 
            size="big" 
            shape="square"
            onClick={handleHomebuyerClick}
          />
          
          <Button 
            name="Investor Dashboard" 
            size="big" 
            shape="square"
            onClick={handleInvestorClick}
          />

          <Button 
            name="Listings" 
            size="big" 
            shape="square"
            onClick={() => navigate('/listings')}
          />
        </div>
      </div>
    </div>
  );
};

export default Temp;
