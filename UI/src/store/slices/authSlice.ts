import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  lastLoginAt?: string;
  roles?: Role[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to check if token is expired
const isTokenExpired = (token: string | null, expiryDateStr: string | null): boolean => {
  if (!token || !expiryDateStr) {
    return true;
  }

  try {
    // Check expiry date from localStorage first
    const expiryDate = new Date(expiryDateStr);
    if (expiryDate < new Date()) {
      return true;
    }

    // Also decode JWT to check expiration (in case expiry date is missing)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    if (exp < Date.now()) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Load user from localStorage on init
const loadUserFromStorage = (): Partial<AuthState> => {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const expiryDateStr = localStorage.getItem('tokenExpiry');

  if (token && userStr && !isTokenExpired(token, expiryDateStr)) {
    return {
      user: JSON.parse(userStr),
      token,
      isAuthenticated: true,
    };
  }

  // If token is expired, clear it
  if (token && isTokenExpired(token, expiryDateStr)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }

  return {};
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user, expiresAt } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tokenExpiry', expiresAt);
      
      return { token, user };
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string; phone?: string; avatar?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      const { token, user, expiresAt } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tokenExpiry', expiresAt);
      
      return { token, user };
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { ...initialState, ...loadUserFromStorage() },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Registration failed';
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

