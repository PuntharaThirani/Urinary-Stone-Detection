import api from './api';

const authService = {
  // 1. User Register කිරීම
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // 2. User Login වීම
  login: async (userData) => {
    try {
      const response = await api.post('/auth/login', userData);
      if (response.data.token) {
        // Token එක LocalStorage එකේ Save කරගන්නවා
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // 3. Logout වීම (Local Storage සුද්ද කිරීම)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
};

export default authService;