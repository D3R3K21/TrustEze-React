import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './Investor.css';
import Panel from '../components/CommonComponents/Panel';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Investor: React.FC = () => {
  // Stacked Bar Chart Data
  const stackedBarData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [55, 50, 50, 50, 50],
        backgroundColor: '#4a3c34',
        borderColor: '#4a3c34',
        borderWidth: 0,
      },
      {
        label: 'Dataset 2',
        data: [0, 20, 40, 50, 60],
        backgroundColor: '#605246',
        borderColor: '#605246',
        borderWidth: 0,
      },
      {
        label: 'Dataset 3',
        data: [0, 0, 0, 20, 60],
        backgroundColor: '#776B60',
        borderColor: '#776B60',
        borderWidth: 0,
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#B0B0B0',
        },
      },
      y: {
        stacked: true,
        grid: {
          color: '#404040',
        },
        ticks: {
          color: '#B0B0B0',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
        },
      },
    },
  };

  // Line Chart Data
  const lineData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
    datasets: [
      {
        label: '20-Year Outlook',
        data: [105000, 115000, 110000, 105000, 108000, 110000, 130000, 125000, 130000, 140000],
        borderColor: '#8B7355',
        backgroundColor: 'rgba(139, 115, 85, 0.2)',
        fill: true,
        tension: 0.1,
        pointBackgroundColor: '#8B7355',
        pointBorderColor: '#8B7355',
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#B0B0B0',
        },
      },
      y: {
        grid: {
          color: '#404040',
        },
        ticks: {
          color: '#B0B0B0',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return '$' + context.raw.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="investor-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to the Investor Dashboard</h1>
        <p>Here you can find all the necessary information about your investments, reports, and settings.</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Top Row Cards */}
        <div className="card portfolio-card">
          <div className="card-content">
            <div className="main-value">$270,400</div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{width: '75%'}}></div>
            </div>
            <div className="subtitle">Estimated Portfolio Value</div>
          </div>
        </div>
        
        <div className="card balance-card">
          {/* <div className="card-content">
            <div className="main-value">$20,209.98</div>
            <div className="subtitle">Account Balance</div>
          </div> */}
          <Panel title="Account Balance" subtitle="$20,209.98" />
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
            <p>Own another property for as low as $5,000 per share.</p>
            <p>New homes are being added on a regular basis.</p>
            <button className="primary-button">Browse New Listings</button>
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
                    <td>$1,000</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                  <tr>
                    <td>1000 N Main St.</td>
                    <td>Ind</td>
                    <td>1</td>
                    <td>$1,000</td>
                    <td><button className="view-link">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="card chart-card">
          <div className="chart-container">
            <Bar data={stackedBarData} options={stackedBarOptions} />
          </div>
        </div>
        
        <div className="card chart-card">
          <div className="chart-container">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investor;
