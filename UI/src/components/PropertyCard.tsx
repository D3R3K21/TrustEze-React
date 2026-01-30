import React from 'react';
import { Property } from '../types';
import './PropertyCard.css';

/** Zillow/hasdata raw property shape (optional – card works with normalized Property too). */
export interface ZillowPropertyShape {
  id: string;
  url?: string;
  homeType?: string;
  image?: string;
  status?: string;
  currency?: string;
  price: number;
  daysOnZillow?: number;
  area?: number;
  lotAreaValue?: number;
  lotAreaUnits?: string | null;
  addressRaw?: string;
  address?: { street?: string; city?: string; state?: string; zipcode?: string };
  latitude?: number;
  longitude?: number;
  photos?: string[];
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  baths?: number;
}

type PropertyCardProperty = Property | ZillowPropertyShape;

function isZillowShape(p: PropertyCardProperty): p is ZillowPropertyShape {
  return 'addressRaw' in p || ('address' in p && typeof (p as ZillowPropertyShape).address === 'object');
}

function getDisplayValues(property: PropertyCardProperty) {
  if (isZillowShape(property)) {
    const addr = property.address;
    const street = addr?.street ?? '';
    const city = addr?.city ?? '';
    const state = addr?.state ?? '';
    const zipcode = addr?.zipcode ?? '';
    const addressLine = property.addressRaw ?? ([street, city, state, zipcode].filter(Boolean).join(', ') || property.id);
    const status = (property.status ?? '').toUpperCase();
    const isForSale = status === 'FOR_SALE';
    const isForRent = status === 'FOR_RENT';
    const imageUrl = property.image ?? property.photos?.[0];
    const homeType = (property.homeType ?? 'SINGLE_FAMILY').replace(/_/g, ' ').toLowerCase();
    const propertyTypeDisplay = homeType.replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: property.id,
      imageUrl,
      title: addressLine,
      addressLine,
      city,
      state,
      zipCode: zipcode,
      price: property.price,
      isForSale,
      isForRent,
      bedrooms: property.bedrooms ?? property.beds ?? 0,
      bathrooms: property.bathrooms ?? property.baths ?? 0,
      squareFeet: property.area ?? 0,
      lotAreaValue: property.lotAreaValue,
      lotAreaUnits: property.lotAreaUnits ?? 'sqft',
      propertyTypeDisplay,
      description: '',
      features: [] as string[],
      realtorName: '',
      daysOnZillow: property.daysOnZillow,
      url: property.url,
    };
  }
  const p = property as Property;
  const propertyTypeDisplay = p.propertyType
    ? `${p.propertyType.charAt(0).toUpperCase()}${p.propertyType.slice(1)}`
    : '';
  return {
    id: p.id,
    imageUrl: p.images?.[0],
    title: p.title,
    addressLine: [p.address, p.city, p.state, p.zipCode].filter(Boolean).join(', '),
    city: p.city,
    state: p.state,
    zipCode: p.zipCode,
    price: p.price,
    isForSale: p.isForSale,
    isForRent: p.isForRent,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    squareFeet: p.squareFeet,
    lotAreaValue: p.lotSize,
    lotAreaUnits: 'sqft' as string,
    propertyTypeDisplay,
    description: p.description ?? '',
    features: p.features ?? [],
    realtorName: p.realtor?.name ?? '',
    daysOnZillow: undefined,
    url: undefined,
  };
}

interface PropertyCardProps {
  property: PropertyCardProperty;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const d = getDisplayValues(property);

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
        {d.imageUrl ? (
          <img
            src={d.imageUrl}
            alt={d.title}
            className="property-image"
          />
        ) : (
          <div className="property-image property-image-placeholder" aria-hidden>No image</div>
        )}
        <div className="property-price">
          {formatPrice(d.price)}
        </div>
        <div className="property-status">
          {d.isForSale ? 'For Sale' : d.isForRent ? 'For Rent' : 'Listing'}
        </div>
      </div>

      <div className="property-content">
        <h3 className="property-title">{d.title}</h3>
        <p className="property-address">
          {[d.addressLine || d.title, d.city, d.state, d.zipCode].filter(Boolean).join(', ')}
        </p>

        <div className="property-details">
          <div className="property-specs">
            <span className="spec">
              <span className="spec-icon">🛏️</span>
              {d.bedrooms > 0 ? `${d.bedrooms} bed` : '— bed'}
            </span>
            <span className="spec">
              <span className="spec-icon">🚿</span>
              {d.bathrooms > 0 ? `${d.bathrooms} bath` : '— bath'}
            </span>
            {d.squareFeet > 0 && (
              <span className="spec">
                <span className="spec-icon">📐</span>
                {d.squareFeet.toLocaleString()} sq ft
              </span>
            )}
            {d.lotAreaValue != null && d.lotAreaValue > 0 && (
              <span className="spec">
                <span className="spec-icon">🏞️</span>
                {d.lotAreaValue.toLocaleString()} {d.lotAreaUnits}
              </span>
            )}
          </div>

          <div className="property-type">
            {d.propertyTypeDisplay}
          </div>
        </div>

        {(d.daysOnZillow != null && d.daysOnZillow >= 0) && (
          <p className="property-days-on-market">
            {d.daysOnZillow === 0 ? 'New listing' : `${d.daysOnZillow} day${d.daysOnZillow === 1 ? '' : 's'} on Zillow`}
          </p>
        )}

        {d.description && (
          <p className="property-description">
            {d.description.length > 120
              ? `${d.description.substring(0, 120)}...`
              : d.description}
          </p>
        )}

        <div className="property-features">
          {d.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
          {d.features.length > 3 && (
            <span className="feature-tag more">
              +{d.features.length - 3} more
            </span>
          )}
        </div>

        {d.realtorName && (
          <div className="property-realtor">
            <span className="realtor-label">Listed by:</span>
            <span className="realtor-name">{d.realtorName}</span>
          </div>
        )}

        {d.url && (
          <a
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            className="property-link"
            onClick={(e) => e.stopPropagation()}
          >
            View on Zillow →
          </a>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
