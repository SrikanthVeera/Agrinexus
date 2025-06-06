/**
 * Utility functions for authentication
 */

import axios from 'axios';

/**
 * Set the authentication token in axios headers
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

/**
 * Store user data in localStorage
 * @param {Object} userData - User data object
 */
export const storeUserData = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('user');
  }
};

/**
 * Get stored user data from localStorage
 * @returns {Object|null} User data object or null
 */
export const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Get stored token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getStoredToken() && !!getStoredUserData();
};

/**
 * Check if the user has a specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role, false otherwise
 */
export const hasRole = (role) => {
  const userData = getStoredUserData();
  return userData && userData.role === role;
};

/**
 * Verify token with backend
 * @returns {Promise<Object>} Response data
 */
export const verifyToken = async () => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No token found');
    }
    
    setAuthToken(token);
    const response = await axios.get('http://localhost:5001/api/auth/verify-token');
    return response.data;
  } catch (error) {
    clearAuthData();
    throw error;
  }
};