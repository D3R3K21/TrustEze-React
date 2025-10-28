import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { propertiesAPI } from '../../services/api';

export interface Realtor {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType: string;
  isForSale: boolean;
  isForRent: boolean;
  listingDate: string;
  images: string[];
  features: string[];
  realtor: Realtor;
}

export interface PagedResult {
  items: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PropertiesState {
  properties: Property[];
  featuredProperties: Property[];
  currentProperty: Property | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    minSquareFeet?: number;
    maxSquareFeet?: number;
    propertyType?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    sortBy: string;
  };
}

const initialState: PropertiesState = {
  properties: [],
  featuredProperties: [],
  currentProperty: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  isLoading: false,
  error: null,
  filters: {
    sortBy: 'newest',
  },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (params: any, { getState }) => {
    const response = await propertiesAPI.getAll(params);
    return response.data;
  }
);

export const fetchFeaturedProperties = createAsyncThunk(
  'properties/fetchFeatured',
  async () => {
    const response = await propertiesAPI.getFeatured();
    return response.data;
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchById',
  async (id: string) => {
    const response = await propertiesAPI.getById(id);
    return response.data;
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PropertiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { sortBy: 'newest' };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      });

    // Fetch featured properties
    builder
      .addCase(fetchFeaturedProperties.fulfilled, (state, action) => {
        state.featuredProperties = action.payload;
      });

    // Fetch property by ID
    builder
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.currentProperty = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearCurrentProperty } = propertiesSlice.actions;
export default propertiesSlice.reducer;

