import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { mockProperties } from '../data/mockData';
import './Home.css';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const featuredProperties = mockProperties.slice(0, 6);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Dream Home</h1>
            <p>
              Discover thousands of verified properties with our advanced search tools. 
              TrustEze makes buying your next home simple, secure, and stress-free.
            </p>
            <div className="hero-buttons">
              <Link to="/search" className="btn">
                Start Searching
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Properties Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Expert Agents</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Properties</h2>
          <div className="properties-grid">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/search" className="btn btn-secondary">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose TrustEze?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>Find exactly what you're looking for with our powerful search filters and AI-powered recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Verified Properties</h3>
              <p>All our listings are verified by our team of experts to ensure accuracy and quality.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Expert Agents</h3>
              <p>Connect with experienced real estate professionals who know the local market inside and out.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Search and browse properties on any device with our responsive, mobile-optimized platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>We work with you to find the best deals and negotiate the most favorable terms.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Process</h3>
              <p>Your personal information and transactions are protected with bank-level security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Next Home?</h2>
            <p>Join thousands of satisfied customers who found their dream home with TrustEze.</p>
            <div className="cta-buttons">
              <Link to="/search" className="btn">
                Start Your Search
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn btn-outline">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
