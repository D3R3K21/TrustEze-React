import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeaturedProperties } from '../store/slices/propertiesSlice';
import PropertyCard from '../components/PropertyCard';
import { Container, Grid, Typography, Box } from '@mui/material';
import './Listings.css';

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
      <div className="container">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box className="listings-header" sx={{ textAlign: 'left' }}>
              <Typography variant="h3" component="h1" gutterBottom>
                Featured Listings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore curated properties handpicked for value and desirability.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
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
              <Grid container spacing={4} justifyContent="center">
                {featuredProperties.map((property) => (
                  <Grid item key={property.id} xs={12} sm={6} md={4} lg={4} display="flex" justifyContent="center">
                    <Box sx={{ width: '100%', maxWidth: 380 }}>
                      <PropertyCard property={property} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Listings;


