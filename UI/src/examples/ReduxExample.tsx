/**
 * Example component demonstrating Redux usage
 * This file shows how to use Redux in your components
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchFeaturedProperties,
  fetchProperties,
  setFilters,
  clearFilters,
} from '../store/slices/propertiesSlice';
import { fetchUserProfile } from '../store/slices/userSlice';
import { loginUser } from '../store/slices/authSlice';

export const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select data from Redux store
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { properties, featuredProperties, isLoading } = useAppSelector(
    (state) => state.properties
  );
  const { profile, savedProperties } = useAppSelector((state) => state.user);

  // Load data on component mount
  useEffect(() => {
    // Fetch featured properties
    dispatch(fetchFeaturedProperties());

    // If authenticated, fetch user-specific data
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  // Example: Login user
  const handleLogin = async () => {
    try {
      await dispatch(
        loginUser({
          email: 'user@example.com',
          password: 'password123',
        })
      ).unwrap();
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Example: Search properties
  const handleSearch = async () => {
    const searchParams = {
      minPrice: 100000,
      maxPrice: 500000,
      bedrooms: 3,
      city: 'San Francisco',
      page: 1,
      pageSize: 10,
      sortBy: 'price-asc',
    };

    try {
      await dispatch(fetchProperties(searchParams)).unwrap();
      console.log('Properties loaded successfully!');
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
  };

  // Example: Update filters
  const updateSearchFilters = () => {
    dispatch(
      setFilters({
        city: 'Los Angeles',
        bedrooms: 2,
        minPrice: 200000,
      })
    );
  };

  // Example: Clear filters
  const resetFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div>
      <h1>Redux Example</h1>

      {/* Authentication Status */}
      <section>
        <h2>Authentication</h2>
        {isAuthenticated ? (
          <div>
            <p>Welcome, {user?.name || 'User'}!</p>
            <p>Email: {user?.email}</p>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </section>

      {/* Properties List */}
      <section>
        <h2>Properties</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Total: {properties.length} properties</p>
            <div>
              {properties.map((property) => (
                <div key={property.id}>
                  <h3>{property.title}</h3>
                  <p>
                    {property.city}, {property.state} - ${property.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleSearch}>Search Properties</button>
      </section>

      {/* Featured Properties */}
      <section>
        <h2>Featured Properties</h2>
        <p>Count: {featuredProperties.length}</p>
      </section>

      {/* User Profile */}
      {profile && (
        <section>
          <h2>User Profile</h2>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </section>
      )}

      {/* Saved Properties */}
      {savedProperties.length > 0 && (
        <section>
          <h2>Saved Properties</h2>
          <p>Count: {savedProperties.length}</p>
        </section>
      )}

      {/* Filter Controls */}
      <section>
        <h2>Filter Controls</h2>
        <button onClick={updateSearchFilters}>Update Filters</button>
        <button onClick={resetFilters}>Clear Filters</button>
      </section>
    </div>
  );
};

