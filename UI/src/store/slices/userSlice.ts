import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';
import { Property } from './propertiesSlice';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface UserState {
  profile: UserProfile | null;
  savedProperties: Property[];
  recentlyViewed: Property[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  savedProperties: [],
  recentlyViewed: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await userAPI.getProfile();
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: { name: string; phone?: string; avatar?: string }) => {
    const response = await userAPI.updateProfile(data);
    return response.data;
  }
);

export const fetchSavedProperties = createAsyncThunk(
  'user/fetchSavedProperties',
  async () => {
    const response = await userAPI.getSavedProperties();
    return response.data;
  }
);

export const saveProperty = createAsyncThunk(
  'user/saveProperty',
  async (propertyId: string) => {
    await userAPI.saveProperty(propertyId);
    return propertyId;
  }
);

export const removeSavedProperty = createAsyncThunk(
  'user/removeSavedProperty',
  async (propertyId: string) => {
    await userAPI.removeSavedProperty(propertyId);
    return propertyId;
  }
);

export const fetchRecentlyViewed = createAsyncThunk(
  'user/fetchRecentlyViewed',
  async () => {
    const response = await userAPI.getRecentlyViewed();
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch profile';
      });

    // Update profile
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update profile';
      });

    // Fetch saved properties
    builder
      .addCase(fetchSavedProperties.fulfilled, (state, action) => {
        state.savedProperties = action.payload;
      });

    // Save property
    builder
      .addCase(saveProperty.fulfilled, (state, action) => {
        // Property is saved on backend, we might want to refetch the list
      });

    // Remove saved property
    builder
      .addCase(removeSavedProperty.fulfilled, (state, action) => {
        state.savedProperties = state.savedProperties.filter(
          (p) => p.id !== action.payload
        );
      });

    // Fetch recently viewed
    builder
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      });
  },
});

export const { clearProfile, setProfile } = userSlice.actions;
export default userSlice.reducer;

