import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeaturedProperties } from '../store/slices/propertiesSlice';
import PropertyCard from '../components/PropertyCard';
import ListingsHeader from '../components/ListingsHeader';
import PropertyMap from '../components/PropertyMap';
import { Box } from '@mui/material';
import './Listings.css';
import { Property as PropertyType } from '../types';

const Listings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredProperties, isLoading, error } = useAppSelector((state) => state.properties);

  useEffect(() => {
    if (featuredProperties.length === 0) {
      dispatch(fetchFeaturedProperties());
    }
  }, [dispatch, featuredProperties.length]);

  return (
    <div className="listings-page">
      <ListingsHeader />
      <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Box sx={{ mt: 0 }}>
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading featured properties...</p>
            </div>
          ) : error ? (
            <div className="no-results">
              <div className="no-results-icon">⚠️</div>
              <h3>Unable to load listings</h3>
              <p>Please try again later.</p>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🏠</div>
              <h3>No featured properties available</h3>
              <p>Check back soon for new listings.</p>
            </div>
          ) : (
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
                <PropertyMap properties={featuredProperties as PropertyType[]} />
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
                {featuredProperties.map((property) => (
                  <Box key={property.id}>
                    <PropertyCard property={property as PropertyType} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Listings;


