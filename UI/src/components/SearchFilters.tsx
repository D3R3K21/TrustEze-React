import React from 'react';
import { SearchFilters as SearchFiltersType } from '../types';
import './SearchFilters.css';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear
}) => {
  const handleInputChange = (field: keyof SearchFiltersType, value: string | number) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined
    });
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Search Filters</h3>
        <button onClick={onClear} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">Price Range</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value) || 0)}
              className="filter-input"
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value) || 0)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="filter-group">
          <label className="filter-label">Bedrooms</label>
          <select
            value={filters.bedrooms || ''}
            onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
            className="filter-select"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div className="filter-group">
          <label className="filter-label">Bathrooms</label>
          <select
            value={filters.bathrooms || ''}
            onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
            className="filter-select"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="1.5">1.5+</option>
            <option value="2">2+</option>
            <option value="2.5">2.5+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Square Feet */}
        <div className="filter-group">
          <label className="filter-label">Square Feet</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min Sq Ft"
              value={filters.minSquareFeet || ''}
              onChange={(e) => handleInputChange('minSquareFeet', parseInt(e.target.value) || 0)}
              className="filter-input"
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              placeholder="Max Sq Ft"
              value={filters.maxSquareFeet || ''}
              onChange={(e) => handleInputChange('maxSquareFeet', parseInt(e.target.value) || 0)}
              className="filter-input"
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="filter-group">
          <label className="filter-label">Property Type</label>
          <select
            value={filters.propertyType || ''}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className="filter-select"
          >
            <option value="">Any Type</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>

        {/* Location */}
        <div className="filter-group">
          <label className="filter-label">City</label>
          <input
            type="text"
            placeholder="Enter city"
            value={filters.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">State</label>
          <input
            type="text"
            placeholder="Enter state"
            value={filters.state || ''}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">ZIP Code</label>
          <input
            type="text"
            placeholder="Enter ZIP"
            value={filters.zipCode || ''}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filters-actions">
        <button onClick={onSearch} className="btn search-btn">
          Search Properties
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
