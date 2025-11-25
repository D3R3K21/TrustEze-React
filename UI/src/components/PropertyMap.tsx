import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../types';

// Fix for default marker icons in React/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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
          <Marker position={userLocation}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Property markers */}
        {properties.map((property) => {
          const coordinates = propertyCoordinates.get(property.id);
          if (!coordinates) return null;

          return (
            <Marker 
              key={property.id} 
              position={coordinates}
              eventHandlers={{
                click: () => {
                  if (onPropertyClick) {
                    onPropertyClick(property);
                  }
                }
              }}
            >
              <Tooltip 
                permanent={false}
                direction="top"
                offset={[0, -10]}
                opacity={0.9}
              >
                <div style={{ 
                  textAlign: 'center',
                  minWidth: '150px',
                  maxWidth: '200px'
                }}>
                  <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    {property.title}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#8b7355', fontWeight: 'bold' }}>
                    ${property.price.toLocaleString()}
                  </span>
                  <br />
                  <span style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '2px' }}>
                    {property.bedrooms} bed • {property.bathrooms} bath
                  </span>
                </div>
              </Tooltip>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                    {property.title}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                    {property.address}, {property.city}, {property.state}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#8b7355', display: 'block', marginBottom: '6px' }}>
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
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;

