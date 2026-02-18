import React, { useState, useEffect } from 'react';
import { SearchFilters as SearchFiltersType, Property } from '../types';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import { mockProperties } from '../data/mockData';
import { getRiskRating } from '../utils/riskRating';
import './Search.css';

const Search: React.FC = () => {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'oldest'>('newest');

  // Filter properties based on current filters
  const filterProperties = (properties: Property[], currentFilters: SearchFiltersType): Property[] => {
    return properties.filter(property => {
      // Keyword search (title, address, city)
      if (currentFilters.keyword) {
        const k = currentFilters.keyword.toLowerCase();
        const match =
          property.title?.toLowerCase().includes(k) ||
          property.address?.toLowerCase().includes(k) ||
          property.city?.toLowerCase().includes(k);
        if (!match) return false;
      }

      // States filter (multi)
      if (currentFilters.states && currentFilters.states.length > 0) {
        if (!currentFilters.states.includes(property.state)) return false;
      }

      // Risk filter
      if (currentFilters.riskLevels && currentFilters.riskLevels.length > 0) {
        const level = getRiskRating(property.id);
        if (!currentFilters.riskLevels.includes(level)) return false;
      }

      // Price filter (min/max from share price or legacy)
      if (currentFilters.minPrice != null && property.price < currentFilters.minPrice) return false;
      if (currentFilters.maxPrice != null && property.price > currentFilters.maxPrice) return false;

      // Legacy filters (still supported)
      if (currentFilters.bedrooms && property.bedrooms < currentFilters.bedrooms) return false;
      if (currentFilters.bathrooms && property.bathrooms < currentFilters.bathrooms) return false;
      if (currentFilters.minSquareFeet && property.squareFeet < currentFilters.minSquareFeet) return false;
      if (currentFilters.maxSquareFeet && property.squareFeet > currentFilters.maxSquareFeet) return false;
      if (currentFilters.propertyType && property.propertyType !== currentFilters.propertyType) return false;
      if (currentFilters.city && !property.city.toLowerCase().includes(currentFilters.city.toLowerCase())) return false;
      if (currentFilters.state && !property.state.toLowerCase().includes(currentFilters.state.toLowerCase())) return false;
      if (currentFilters.zipCode && !property.zipCode.includes(currentFilters.zipCode)) return false;

      return true;
    });
  };

  // Sort properties based on selected sort option
  const sortProperties = (properties: Property[], sortOption: string): Property[] => {
    const sorted = [...properties];
    
    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime());
      default:
        return sorted;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filtered = filterProperties(mockProperties, filters);
    const sorted = sortProperties(filtered, sortBy);
    setFilteredProperties(sorted);
    setLoading(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilteredProperties(mockProperties);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  // Auto-search when filters change
  useEffect(() => {
    const filtered = filterProperties(mockProperties, filters);
    const sorted = sortProperties(filtered, sortBy);
    setFilteredProperties(sorted);
  }, [filters, sortBy]);

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Find Your Perfect Home</h1>
          <p>Use our advanced filters to narrow down your search and find exactly what you're looking for.</p>
        </div>

        <div className="search-layout">
          <div className="search-filters-wrap">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              onClear={handleClearFilters}
            />
          </div>

          <div className="results-section">
            <div className="results-header">
              <div className="results-info">
                <h2>
                  {loading ? 'Searching...' : `${filteredProperties.length} Properties Found`}
                </h2>
                {!loading && (
                  <p>
                    {Object.keys(filters).length > 0 
                      ? 'Based on your search criteria' 
                      : 'Showing all available properties'
                    }
                  </p>
                )}
              </div>
              
              <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Searching for properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🏠</div>
                <h3>No properties found</h3>
                <p>Try adjusting your search filters to see more results.</p>
                <button onClick={handleClearFilters} className="btn btn-outline">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {filteredProperties.length > 0 && (
              <div className="results-footer">
                <p>Showing {filteredProperties.length} of {mockProperties.length} properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
