import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeaturedProperties } from '../store/slices/propertiesSlice';
import PropertyCard from '../components/PropertyCard';
import ListingsHeader from '../components/ListingsHeader';
import { Typography, Box } from '@mui/material';
import './Listings.css';
import { Property as PropertyType } from '../types';
import axios from 'axios';

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
      <div className="container" style={{ paddingTop: '2rem' }}>
        <Box>
          <Box className="listings-header" sx={{ textAlign: 'left' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Featured Listings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore curated properties handpicked for value and desirability.
            </Typography>
          </Box>
        </Box>

        <Box>
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
            <div className="properties-grid">
              {featuredProperties.map((property) => (
                <Box key={property.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: '100%', maxWidth: 380 }}>
                    <PropertyCard property={property as PropertyType} />
                  </Box>
                </Box>
              ))}
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Listings;


