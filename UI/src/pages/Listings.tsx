import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDrockSearch } from '../store/slices/drockSearchSlice';
import PropertyCard from '../components/PropertyCard';
import ListingsHeader from '../components/ListingsHeader';
import PropertyMap from '../components/PropertyMap';
import PropertyModal from '../components/PropertyModal';
import { Box } from '@mui/material';
import './Listings.css';
import { Property as PropertyType } from '../types';

const Listings: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    results: drockSearchResults,
    loading: drockSearchLoading,
    error: drockSearchError,
  } = useAppSelector((state) => state.drockSearch);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasFetchedDrockRef = useRef(false);

  useEffect(() => {
    if (hasFetchedDrockRef.current) return;
    hasFetchedDrockRef.current = true;
    dispatch(
      fetchDrockSearch({
        Keyword: 'scottsdale',
        Type: 'forSale',
        'Price.Min': 100000,
        'Price.Max': 500000,
        // 'Beds.Min': 2,
        // 'Beds.Max': 6,
        // 'Baths.Min': 2,
        // 'Baths.Max': 4,
        // 'YearBuilt.Min': 1995,
        // 'YearBuilt.Max': 2025,
        // 'SquareFeet.Min': 1200,
        // 'SquareFeet.Max': 4000,
        Page: 1,
      })
    );
  }, [dispatch]);

  const handlePropertyClick = (property: PropertyType) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="listings-page">
      <ListingsHeader />
      <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Box sx={{ mt: 0 }}>
          {drockSearchLoading && drockSearchResults.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : drockSearchError && drockSearchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">⚠️</div>
              <h3>Unable to load listings</h3>
              <p>{drockSearchError}</p>
            </div>
          ) : drockSearchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <>
              {drockSearchError && (
                <div
                  className="listings-cache-banner"
                  style={{
                    padding: '8px 12px',
                    marginBottom: '8px',
                    background: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#856404',
                  }}
                >
                  Showing cached results. Could not refresh: {drockSearchError}
                </div>
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 1 },
                  margin: 0,
                }}
              >
              {/* Map - Left side (50% width) */}
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  flexShrink: 0,
                  margin: 0,
                  height: { xs: '400px', md: 'calc(100vh - 180px)' },
                  minHeight: { xs: '400px', md: 'calc(100vh - 180px)' },
                  borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
                  position: 'relative',
                }}
              >
                <PropertyMap 
                  properties={drockSearchResults as PropertyType[]} 
                  onPropertyClick={handlePropertyClick}
                />
              </Box>

              {/* Property cards - Right side (50% width) */}
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: { xs: 'none', md: 'calc(100vh - 180px)' },
                  overflowY: { xs: 'visible', md: 'auto' },
                  padding: { xs: '1rem', md: '1rem' },
                  margin: 0,
                }}
              >
                {drockSearchResults.map((property) => (
                  <Box key={property.id}>
                    <PropertyCard 
                      property={property as PropertyType}
                      onClick={() => handlePropertyClick(property as PropertyType)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            </>
          )}
        </Box>
      </div>
      <PropertyModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Listings;


