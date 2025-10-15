import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (item: string) => {
    setOpenDropdowns(prev => 
      prev.includes(item) 
        ? prev.filter(dropdown => dropdown !== item)
        : [...prev, item]
    );
  };

  const navigationItems = [
    { 
      path: '/homebuyer', 
      label: 'Dashboard', 
      hasDropdown: false 
    },
    { 
      path: '/account', 
      label: 'Account', 
      hasDropdown: true,
      subItems: [
        { path: '/account/details', label: 'Details' },
        { path: '/account/username-password', label: 'Username/Password' },
        { path: '/account/address', label: 'Address' },
        { path: '/account/bank-account', label: 'Bank Account' }
      ]
    },
    { 
      path: '/documentation', 
      label: 'Documentation', 
      hasDropdown: true,
      subItems: [
        { path: '/documentation/legal-documents', label: 'Legal Documents' },
        { path: '/documentation/mortgage-information', label: 'Mortgage Information' }
      ]
    },
    { 
      path: '/marketplace', 
      label: 'Marketplace', 
      hasDropdown: false 
    },
    { 
      path: '/education', 
      label: 'Education', 
      hasDropdown: true,
      subItems: [
        { path: '/education/housing-markets', label: 'Housing Markets' },
        { path: '/education/home-values', label: 'Home Values & Equity' },
        { path: '/education/home-improvements', label: 'Home Improvements' }
      ]
    },
    { 
      path: '/help', 
      label: 'Help', 
      hasDropdown: true,
      subItems: [
        { path: '/help/how-does-it-work', label: 'How Does it Work?' },
        { path: '/help/faqs', label: "FAQ's" },
        { path: '/help/support', label: 'Support' }
      ]
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      hasDropdown: false 
    },
  ];

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // You can add logic here to actually toggle dark mode
  };

  return (
    <aside className="sidebar">
      <div className="title-container">
        <span className="brand-primary">TRUSTKEYS</span>
        <div className="subtitle">
          <span className="line"></span>
          <span className="subtitle-text">HOMES</span>
        </div>
      </div>
      
      <ul className="nav-menu">
        {navigationItems.map((item) => (
          <li key={item.path} className={item.hasDropdown ? 'dropdown-menu' : ''}>
            <Link
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={item.hasDropdown ? (e) => {
                e.preventDefault();
                toggleDropdown(item.label);
              } : undefined}
            >
              <span className="nav-label">{item.label}</span>
              {item.hasDropdown && (
                <i className={`fas fa-caret-down ${openDropdowns.includes(item.label) ? 'rotated' : ''}`}></i>
              )}
            </Link>
            
            {item.hasDropdown && item.subItems && (
              <ul className={`sub-menu ${openDropdowns.includes(item.label) ? 'open' : ''}`}>
                {item.subItems.map((subItem) => (
                  <li key={subItem.path}>
                    <Link to={subItem.path} className="sub-menu-link">
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="bottom-links">
        <div className="bottom-link">
          <Link to="/investor" className="switch-dashboard-btn">
            Switch to Investor Dashboard
          </Link>
        </div>
        
        <div className="toggle-container">
          <label className="toggle-label" htmlFor="dark-mode-toggle">Dark Mode</label>
          <label className="switch">
            <input 
              type="checkbox" 
              id="dark-mode-toggle"
              checked={isDarkMode}
              onChange={handleDarkModeToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
