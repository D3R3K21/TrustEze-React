import React from 'react';
import './Homebuyer.css';

const Homebuyer: React.FC = () => {
  return (
    <div className="homebuyer-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to the Homebuyer Dashboard</h1>
        <p>Here you can find all the necessary information about your home, reports, and settings.</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Top Row Cards */}
        <div className="card payment-card">
          <div className="card-content">
            <div className="main-value">$1,400</div>
            <div className="subtitle">Due in 8 days</div>
            <button className="primary-button">Make a Payment</button>
          </div>
        </div>
        
        <div className="card equity-card">
          <div className="card-content">
            <div className="main-value">$20,209.98</div>
            <div className="subtitle">Estimated Equity</div>
          </div>
        </div>
        
        <div className="card returns-card">
          <div className="card-content">
            <div className="returns-table">
              <div className="returns-header">
                <div className="returns-column">Returns</div>
                <div className="returns-column">2019 YTD</div>
                <div className="returns-column">All Time</div>
              </div>
              <div className="returns-row">
                <div className="returns-column">Trust Fees</div>
                <div className="returns-column">$101.41</div>
                <div className="returns-column">$101.41</div>
              </div>
              <div className="returns-row">
                <div className="returns-column">Interest</div>
                <div className="returns-column">$1.46</div>
                <div className="returns-column">$1.46</div>
              </div>
              <div className="returns-row">
                <div className="returns-column">Home Sales</div>
                <div className="returns-column">-$0.24</div>
                <div className="returns-column">-$0.24</div>
              </div>
              <div className="returns-row total-row">
                <div className="returns-column"><strong>Total</strong></div>
                <div className="returns-column"><strong>$102.63</strong></div>
                <div className="returns-column"><strong>$102.63</strong></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Listings Card */}
        <div className="card listings-card">
          <div className="card-content">
            <h2>New Listings</h2>
            <p>Trust shares on your home have been put on sale.</p>
            <p>Purchasing shares in your trust will decrease your monthly payments</p>
            <button className="primary-button">Purchase New Listings</button>
          </div>
        </div>
        
        {/* Breakdown Section */}
        <div className="card breakdown-card">
          <div className="card-content">
            <h2>Breakdown</h2>
            <p>Below is a quick overview of all your properties you currently have shares in. For a full list of properties including properties sold, please go to the archives.</p>
            
            <div className="breakdown-details">
              <div className="breakdown-item">
                <h3>Estimated Portfolio Value</h3>
                <p>Hypothetical Invest projection of $42,307 at age 52</p>
                <p>Weekly recurring amount: 37</p>
                <p>Top Performing | Worse Performing</p>
                <h4>Filters</h4>
                <div className="filter-buttons">
                  <button className="filter-button">Remove Filters</button>
                  <button className="filter-button">Cancel</button>
                  <button className="filter-button">Submit</button>
                </div>
              </div>
            </div>
            
            <div className="property-table-container">
              <table className="property-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Region</th>
                    <th>Shares</th>
                    <th>Value Per Share</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>955 N Willard</td>
                    <td>Ind</td>
                    <td>29</td>
                    <td>$1,100</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                  <tr>
                    <td>918 Hamilton Blvf</td>
                    <td>19</td>
                    <td>8</td>
                    <td>$308</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                  <tr>
                    <td>839 Sectmart Rd</td>
                    <td>16</td>
                    <td>3</td>
                    <td>$2,099</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                  <tr>
                    <td>3892 SW Whitehair Blvd. Unit #209</td>
                    <td>Santa Monica, CA</td>
                    <td>2</td>
                    <td>$490</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                  <tr>
                    <td>122 Selma Rd.</td>
                    <td>Valentino, GA</td>
                    <td>2</td>
                    <td>$490</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homebuyer;
