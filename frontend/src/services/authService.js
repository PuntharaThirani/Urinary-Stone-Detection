import { registerUser, loginUser, logoutUser, getProfile } from './api';

const authService = {
  // Register
  register: async (userData) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Login — token and role saved in api.js
  login: async (userData) => {
    try {
      return await loginUser(userData);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      return await getProfile();
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Logout — clear localStorage
  logout: () => {
    logoutUser();
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current role
  getRole: () => {
    return localStorage.getItem('userRole') || null;
  },
};

export default authService;