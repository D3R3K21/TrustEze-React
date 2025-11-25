import React from 'react';
import { Property } from '../types';
import './PropertyModal.css';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose }) => {
  if (!isOpen || !property) return null;

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

  return (
    <div className="property-modal-backdrop" onClick={handleBackdropClick}>
      <div className="property-modal">
        <button className="property-modal-close" onClick={onClose}>
          ×
        </button>

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
                {property.isForSale && (
                  <span className="status-badge sale">For Sale</span>
                )}
                {property.isForRent && (
                  <span className="status-badge rent">For Rent</span>
                )}
              </div>
            </div>
            <h2 className="property-modal-address">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </h2>
          </div>

          {/* Key Metrics */}
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
            <div className="metric">
              <span className="metric-icon">📐</span>
              <span className="metric-value">{property.squareFeet.toLocaleString()}</span>
              <span className="metric-label">Sq Ft</span>
            </div>
            {property.lotSize && (
              <div className="metric">
                <span className="metric-icon">🏞️</span>
                <span className="metric-value">{property.lotSize}</span>
                <span className="metric-label">Acres</span>
              </div>
            )}
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

