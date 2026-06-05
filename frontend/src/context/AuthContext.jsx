import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  // Load user details if JWT is present in localstorage
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data.user);
        } catch (error) {
          console.error('Failed to load authenticated user profile', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();

    // Listen for axios 401 events to logout instantly in frontend
    const handleLogoutEvent = () => {
      setUser(null);
    };
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      
      showNotification('Successfully logged in!', 'success');
      return loggedUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showNotification(errorMsg, 'error');
      throw error;
    }
  };

  const register = async (name, email, password, address) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, address });
      const { token, user: registeredUser } = res.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      
      showNotification('Account registered successfully!', 'success');
      return registeredUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      const detailErrors = error.response?.data?.errors;
      
      if (detailErrors && Array.isArray(detailErrors)) {
        detailErrors.forEach(err => showNotification(err, 'error'));
      } else {
        showNotification(errorMsg, 'error');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showNotification('Logged out successfully', 'info');
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/users/change-password', { currentPassword, newPassword });
      showNotification('Password updated successfully', 'success');
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Password update failed';
      const detailErrors = error.response?.data?.errors;
      
      if (detailErrors && Array.isArray(detailErrors)) {
        detailErrors.forEach(err => showNotification(err, 'error'));
      } else {
        showNotification(errorMsg, 'error');
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
