import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
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

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data: { name: string; phone?: string; avatar?: string }) =>
    api.put('/api/users/profile', data),
  getSavedProperties: () => api.get('/api/users/saved-properties'),
  saveProperty: (propertyId: string) => api.post(`/api/users/saved-properties/${propertyId}`),
  removeSavedProperty: (propertyId: string) => api.delete(`/api/users/saved-properties/${propertyId}`),
  getRecentlyViewed: () => api.get('/api/users/recently-viewed'),
};

