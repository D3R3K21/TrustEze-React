import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

console.log('API_URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Axios instance created with baseURL:', api.defaults.baseURL);

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  console.log('Making API request to:', config.baseURL + config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('API request succeeded:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API request failed:', error.config?.url, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      // Force page reload to clear Redux state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API request methods
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (data: { email: string; password: string; name: string; phone?: string; avatar?: string }) =>
    api.post('/api/auth/register', data),
};

export const propertiesAPI = {
  getAll: (params?: any) => api.get('/api/properties', { params }),
  getById: (id: string) => api.get(`/api/properties/${id}`),
  getFeatured: () => api.get('/api/properties/featured'),
};

// Drock.io external API for property search
const DROCK_API_BASE = process.env.REACT_APP_DROCK_API_BASE

export interface DrockSearchParams {
  Keyword?: string;
  Type?: string;
  'Price.Min'?: number;
  'Price.Max'?: number;
  'Beds.Min'?: number;
  'Beds.Max'?: number;
  'Baths.Min'?: number;
  'Baths.Max'?: number;
  'YearBuilt.Min'?: number;
  'YearBuilt.Max'?: number;
  'SquareFeet.Min'?: number;
  'SquareFeet.Max'?: number;
  Page?: number;
  PageSize?: number;
}

export const drockAPI = {
  search: async (params: DrockSearchParams = {}): Promise<unknown> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const query = searchParams.toString();
    const url = `${DROCK_API_BASE}/Properties/search${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        (data as { message?: string })?.message ??
        (data as { Message?: string })?.Message ??
        (data as { error?: string })?.error ??
        `Request failed: ${res.status} ${res.statusText}`;
      throw new Error(message);
    }
    return data;
  },
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: { name: string; phone?: string; avatar?: string }) =>
    api.put('/api/users/profile', data),
  getSavedProperties: () => api.get('/api/users/saved-properties'),
  saveProperty: (propertyId: string) => api.post(`/api/users/saved-properties/${propertyId}`),
  removeSavedProperty: (propertyId: string) => api.delete(`/api/users/saved-properties/${propertyId}`),
  getRecentlyViewed: () => api.get('/api/users/recently-viewed'),
};

