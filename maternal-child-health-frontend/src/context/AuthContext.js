import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/user');
      setUser(res.data);
    } catch (err) {
      console.error('Auth error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    await api.get('/sanctum/csrf-cookie');
    const res = await api.post('/api/login', credentials);
    const { token, user } = res.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', user.role);
    setToken(token);
    setUser(user);

    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;
      case "health_worker":
        navigate("/health/dashboard");
        break;
      case "mother":
        navigate("/landing");
        // navigate("/mother/home");
        break;
      default:
        navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
