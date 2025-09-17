import React from 'react';
import { Property } from '../types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card" onClick={onClick}>
      <div className="property-image-container">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="property-image"
        />
        <div className="property-price">
          {formatPrice(property.price)}
        </div>
        <div className="property-status">
          {property.isForSale ? 'For Sale' : 'For Rent'}
        </div>
      </div>
      
      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-address">
          {property.address}, {property.city}, {property.state} {property.zipCode}
        </p>
        
        <div className="property-details">
          <div className="property-specs">
            <span className="spec">
              <span className="spec-icon">🛏️</span>
              {property.bedrooms} bed
            </span>
            <span className="spec">
              <span className="spec-icon">🚿</span>
              {property.bathrooms} bath
            </span>
            <span className="spec">
              <span className="spec-icon">📐</span>
              {property.squareFeet.toLocaleString()} sq ft
            </span>
          </div>
          
          <div className="property-type">
            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
          </div>
        </div>
        
        <p className="property-description">
          {property.description.length > 120 
            ? `${property.description.substring(0, 120)}...` 
            : property.description
          }
        </p>
        
        <div className="property-features">
          {property.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="feature-tag more">
              +{property.features.length - 3} more
            </span>
          )}
        </div>
        
        <div className="property-realtor">
          <span className="realtor-label">Listed by:</span>
          <span className="realtor-name">{property.realtor.name}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
