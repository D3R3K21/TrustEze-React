import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../types';
import { colors } from '../theme';
import { getRiskRating, getRiskColor, getRiskLabel } from '../utils/riskRating';
import { getAvailableSharesPercent } from '../utils/homeBuiltYear';

// Fix for default marker icons in React/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const USER_LOCATION_COLOR = '#dc2626'; // red for "you are here"

/** Default pin size (matches classic Leaflet marker proportions ~25×41). */
const PIN_WIDTH = 24;
const PIN_HEIGHT = 41;

/** Classic teardrop pin path (same shape as default Leaflet marker). */
const PIN_PATH =
  'M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0zm0 17.3c-2.9 0-5.3-2.4-5.3-5.3S9.1 6.7 12 6.7s5.3 2.4 5.3 5.3-2.4 5.3-5.3 5.3z';

/** Create a colored pin icon in the default Leaflet teardrop shape. */
function createColoredIcon(color: string, scale = 1): L.DivIcon {
  const w = PIN_WIDTH * scale;
  const h = PIN_HEIGHT * scale;
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width:${w}px;height:${h}px;position:relative;">
      <svg width="${w}" height="${h}" viewBox="0 0 24 41" style="display:block;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.35));">
        <path fill="${color}" stroke="white" stroke-width="1.5" d="${PIN_PATH}"/>
      </svg>
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
  });
}

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

// Component to handle map centering when location changes
const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const TOTAL_SHARES = 10000;

// Chip styles matching InvestmentModal (price/share chip)
const pricePerShareChipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: 700,
  backgroundColor: `${colors.primary}1f`,
  color: colors.primary,
  border: `1px solid ${colors.primary}4d`,
  whiteSpace: 'nowrap',
};

// Popup body: property info + image, then 2x2 grid (View full details | Risk | Per share | % available)
const PopupContent: React.FC<{
  property: Property;
  onClose: () => void;
  onPropertyClick?: (property: Property) => void;
}> = ({ property, onClose, onPropertyClick }) => {
  const pricePerShare = property.price / TOTAL_SHARES;
  const availablePercent = getAvailableSharesPercent(property.id);
  const riskLevel = getRiskRating(property.id);
  const riskColor = getRiskColor(riskLevel);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '400px',
      }}
      onMouseLeave={onClose}
    >
      {/* Property info + image */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ fontSize: '14px', display: 'block', marginBottom: '6px' }}>
            {property.title}
          </strong>
          <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
            {property.address}, {property.city}, {property.state}
          </span>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: colors.primary, display: 'block', marginBottom: '6px' }}>
            ${property.price.toLocaleString()}
          </span>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #e0e0e0' }}>
            <span>{property.bedrooms} bed</span> • <span>{property.bathrooms} bath</span> • <span>{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
          {property.description && (
            <p style={{ fontSize: '11px', color: '#888', marginTop: '6px', marginBottom: 0 }}>
              {property.description.substring(0, 100)}{property.description.length > 100 ? '...' : ''}
            </p>
          )}
        </div>
        {property.images && property.images.length > 0 && (
          <div
            style={{
              width: '120px',
              height: '120px',
              flexShrink: 0,
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={property.images[0]}
              alt={property.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>

      {/* 2x2 grid: top-left View full details, top-right Risk, bottom-left Per share, bottom-right % available */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <div style={{ justifySelf: 'start' }}>
          {onPropertyClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPropertyClick(property);
              }}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              View full details
            </button>
          )}
        </div>
        <div style={{ justifySelf: 'end' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              backgroundColor: `${riskColor}22`,
              color: riskColor,
              border: `1.5px solid ${riskColor}`,
            }}
          >
            {getRiskLabel(riskLevel)}
          </span>
        </div>
        <div style={{ justifySelf: 'start' }}>
          <span style={pricePerShareChipStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            ${pricePerShare.toFixed(2)} / share
          </span>
        </div>
        <div style={{ justifySelf: 'end' }}>
          <span
            style={{
              ...pricePerShareChipStyle,
              backgroundColor: `${colors.primary}26`,
            }}
          >
            {availablePercent}% available
          </span>
        </div>
      </div>
    </div>
  );
};

// Renders property markers; uses map to ensure only one popup open and to close on mouse leave
const PropertyMarkers: React.FC<{
  properties: Property[];
  propertyCoordinates: Map<string, [number, number]>;
  onPropertyClick?: (property: Property) => void;
}> = ({ properties, propertyCoordinates, onPropertyClick }) => {
  const map = useMap();
  return (
    <>
      {properties.map((property) => {
        const coordinates = propertyCoordinates.get(property.id);
        if (!coordinates) return null;
        const riskLevel = getRiskRating(property.id);
        const pinColor = getRiskColor(riskLevel);
        return (
          <Marker
            key={property.id}
            position={coordinates}
            icon={createColoredIcon(pinColor)}
            eventHandlers={{
              click: (e) => {
                map.closePopup();
                e.target.openPopup();
              },
            }}
          >
            <Popup closeOnClick={false} autoClose={false} closeButton={true}>
              <PopupContent
                property={property}
                onClose={() => map.closePopup()}
                onPropertyClick={onPropertyClick}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const PropertyMap: React.FC<PropertyMapProps> = ({ properties, onPropertyClick }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationError, setShowLocationError] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [propertyCoordinates, setPropertyCoordinates] = useState<Map<string, [number, number]>>(new Map());
  const [showGeocodingIndicator, setShowGeocodingIndicator] = useState(false);

  // Default center (Phoenix, Arizona) as fallback
  const defaultCenter: [number, number] = useMemo(() => [33.4484, -112.0740], []);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  useEffect(() => {
    // Get user's location from browser
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location: [number, number] = [latitude, longitude];
          setUserLocation(location);
          setMapCenter(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLocationError(error.message);
          setShowLocationError(true);
          // Fallback to default center (Phoenix)
          setMapCenter(defaultCenter);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Browser doesn't support geolocation
      setLocationError('Geolocation is not supported by your browser');
      setShowLocationError(true);
      setMapCenter(defaultCenter);
      setIsLoadingLocation(false);
    }
  }, [defaultCenter]);

  // Geocode property addresses to coordinates
  useEffect(() => {
    let indicatorTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const geocodeProperties = async () => {
      if (properties.length === 0) {
        setShowGeocodingIndicator(false);
        return;
      }

      setShowGeocodingIndicator(false);
      
      const coordinatesMap = new Map<string, [number, number]>();

      // First, use coordinates from properties if available
      for (const property of properties) {
        if (property.latitude != null && property.longitude != null) {
          coordinatesMap.set(property.id, [property.latitude, property.longitude]);
        }
      }

      // Only geocode properties that don't have coordinates
      const propertiesToGeocode = properties.filter(
        p => !p.latitude || !p.longitude
      );

      if (propertiesToGeocode.length > 0) {
        // Only show indicator if we actually need to geocode and it takes more than 500ms
        indicatorTimeout = setTimeout(() => {
          setShowGeocodingIndicator(true);
        }, 500);

        for (const property of propertiesToGeocode) {
          try {
            // Build full address string
            const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
            
            // Use OpenStreetMap Nominatim API (free, no API key needed)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
              {
                headers: {
                  'User-Agent': 'TrustEze-React-App' // Required by Nominatim
                }
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                coordinatesMap.set(property.id, [lat, lon]);
              }
            }

            // Rate limiting: Nominatim allows 1 request per second
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.warn(`Failed to geocode property ${property.id}:`, error);
          }
        }
      }

      setPropertyCoordinates(coordinatesMap);
      if (indicatorTimeout) {
        clearTimeout(indicatorTimeout);
      }
      setShowGeocodingIndicator(false);
    };

    geocodeProperties();
    
    // Cleanup function to clear timeout if component unmounts or properties change
    return () => {
      if (indicatorTimeout) {
        clearTimeout(indicatorTimeout);
      }
      setShowGeocodingIndicator(false);
    };
  }, [properties]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style>{`
        .leaflet-marker-icon.custom-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      {isLoadingLocation && !locationError && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            background: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '14px',
          }}
        >
          Getting your location...
        </div>
      )}
      {locationError && showLocationError && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            background: '#fff3cd',
            padding: '8px 12px',
            paddingRight: '28px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '12px',
            color: '#856404',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '300px',
          }}
        >
          <span>Using default location (location access denied or unavailable)</span>
          <button
            onClick={() => setShowLocationError(false)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'transparent',
              border: 'none',
              color: '#856404',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: '1',
              padding: '2px 6px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
      {/* {showGeocodingIndicator && properties.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: (locationError && showLocationError) ? 50 : 10,
            right: 10,
            zIndex: 1000,
            background: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontSize: '12px',
          }}
        >
          Geocoding properties...
        </div>
      )} */}
      <MapContainer
        center={mapCenter}
        zoom={userLocation ? 12 : 10}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <MapCenter center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createColoredIcon(USER_LOCATION_COLOR, 1.15)}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Property markers - single popup at a time, closes on mouse leave */}
        <PropertyMarkers
          properties={properties}
          propertyCoordinates={propertyCoordinates}
          onPropertyClick={onPropertyClick}
        />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;

