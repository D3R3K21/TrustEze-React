import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Property } from '../types';
import { colors } from '../theme';
import './PropertyModal.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const stackedBarData = useMemo(() => ({
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    datasets: [
      { label: 'Dataset 1', data: [55, 50, 50, 50, 50], backgroundColor: '#4a3c34', borderColor: '#4a3c34', borderWidth: 0 },
      { label: 'Dataset 2', data: [0, 20, 40, 50, 60], backgroundColor: '#605246', borderColor: '#605246', borderWidth: 0 },
      { label: 'Dataset 3', data: [0, 0, 0, 20, 60], backgroundColor: '#776B60', borderColor: '#776B60', borderWidth: 0 },
    ],
  }), []);

  const stackedBarOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { color: '#666' } },
      y: { stacked: true, grid: { color: '#e0e0e0' }, ticks: { color: '#666' } },
    },
    plugins: { legend: { labels: { color: '#333' } } },
  }), []);

  const lineData = useMemo(() => ({
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
    datasets: [{
      label: '20-Year Outlook',
      data: [105000, 115000, 110000, 105000, 108000, 110000, 130000, 125000, 130000, 140000],
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}33`,
      fill: true,
      tension: 0.1,
      pointBackgroundColor: colors.primary,
      pointBorderColor: colors.primary,
      pointRadius: 4,
    }],
  }), []);

  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#666' } },
      y: {
        grid: { color: '#e0e0e0' },
        ticks: { color: '#666', callback: (value: unknown) => '$' + Number(value).toLocaleString() },
      },
    },
    plugins: {
      legend: { labels: { color: '#333' } },
      tooltip: { callbacks: { label: (context: { raw: unknown }) => '$' + Number(context.raw).toLocaleString() } },
    },
  }), []);

  if (!isOpen || !property) return null;

  return (
    <div className="property-modal-backdrop" onClick={handleBackdropClick}>
      <div className="property-modal">
        <button className="property-modal-close" onClick={onClose}>
          ×
        </button>

        {/* Charts - above photos */}
        <div className="property-modal-charts">
          <div className="property-modal-chart-card">
            <div className="property-modal-chart-container">
              <Bar data={stackedBarData} options={stackedBarOptions} />
            </div>
          </div>
          <div className="property-modal-chart-card">
            <div className="property-modal-chart-container">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="property-modal-images">
          <div className="property-modal-main-image">
            <img 
              src={property.images && property.images.length > 0 
                ? property.images[0] 
                : 'https://via.placeholder.com/800x600'} 
              alt={property.title}
            />
          </div>
          {property.images && property.images.length > 1 && (
            <div className="property-modal-thumbnails">
              {property.images.slice(1, 5).map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${property.title} ${index + 2}`}
                />
              ))}
              {property.images && property.images.length > 5 && (
                <div className="property-modal-more-images">
                  +{property.images.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="property-modal-content">
          {/* Header Section */}
          <div className="property-modal-header">
            <div className="property-modal-price-section">
              <h1 className="property-modal-price">{formatPrice(property.price)}</h1>
              <div className="property-modal-status-badges">
                {property.isForRent && (
                  <span className="status-badge rent">For Rent</span>
                )}
              </div>
            </div>
            <h2 className="property-modal-address">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </h2>
          </div>

          {/* Key Metrics – bedrooms/bathrooms commented out (data does not provide this info)
          <div className="property-modal-metrics">
            <div className="metric">
              <span className="metric-icon">🛏️</span>
              <span className="metric-value">{property.bedrooms}</span>
              <span className="metric-label">Bedrooms</span>
            </div>
            <div className="metric">
              <span className="metric-icon">🚿</span>
              <span className="metric-value">{property.bathrooms}</span>
              <span className="metric-label">Bathrooms</span>
            </div>
          */}
          <div className="property-modal-metrics">
            <div className="metric">
              <span className="metric-icon">📐</span>
              <span className="metric-value">{property.squareFeet.toLocaleString()}</span>
              <span className="metric-label">Sq Ft</span>
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="property-modal-details-grid">
            <div className="detail-item">
              <span className="detail-label">Property Type</span>
              <span className="detail-value">
                {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
              </span>
            </div>
            {property.yearBuilt && (
              <div className="detail-item">
                <span className="detail-label">Year Built</span>
                <span className="detail-value">{property.yearBuilt}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Price per Sq Ft</span>
              <span className="detail-value">
                ${Math.round(property.price / property.squareFeet).toLocaleString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Listed</span>
              <span className="detail-value">{formatDate(property.listingDate)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="property-modal-section">
            <h3 className="section-title">Description</h3>
            <p className="property-modal-description">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="property-modal-section">
              <h3 className="section-title">Features</h3>
              <div className="property-modal-features">
                {property.features.map((feature, index) => (
                  <span key={index} className="feature-badge">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Realtor Information */}
          <div className="property-modal-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="property-modal-realtor">
              <div className="realtor-info">
                <div className="realtor-name">{property.realtor.name}</div>
                <div className="realtor-company">{property.realtor.company}</div>
                <div className="realtor-contact">
                  <a href={`tel:${property.realtor.phone}`} className="contact-link">
                    📞 {property.realtor.phone}
                  </a>
                  <a href={`mailto:${property.realtor.email}`} className="contact-link">
                    ✉️ {property.realtor.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="property-modal-actions">
            <button className="action-button primary">
              Request a Tour
            </button>
            <button className="action-button secondary">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;

