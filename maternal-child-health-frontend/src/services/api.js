import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Change to your Laravel API URL
  withCredentials: true,            // Needed for Sanctum (cookies)
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
    // Optional: handle 401/403 errors globally
    if (error.response?.status === 401) {
      console.warn('Unauthorized. Redirecting to login...');
      // You can trigger logout or redirect here
    }
    return Promise.reject(error);
  }
);

axios.defaults.withCredentials = true;

export const register = async (formData) => {
  const response = await api.post('/api/register', formData);
  return response.data;
};

export const login = async (formData) => {
  await api.get('/sanctum/csrf-cookie'); // uses baseURL
  const response = await api.post('/api/login', formData);
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/api/user');
  return response.data;
};


export default api;
