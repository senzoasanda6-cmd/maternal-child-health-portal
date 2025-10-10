import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized. Redirecting to login...');
      // Optional: trigger logout or redirect
    }
    return Promise.reject(error);
  }
);

// Auth helpers
export const login = async (credentials) => {
  const response = await api.post('/api/login', credentials);
  return response.data;
};

export const register = async (formData) => {
  const response = await api.post('/api/register', formData);
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/api/user');
  return response.data;
};

export default api;
