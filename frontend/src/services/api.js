import axios from 'axios';

// Backend base URL
const API_URL = 'http://localhost:5000/api';

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 1. Register User
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// 2. Login User
export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);

    const role =
      response.data.role || response.data.user?.role || '';

    if (role) {
      localStorage.setItem('userRole', role);
    }
  }

  return response.data;
};

// 3. Get Profile
export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};

// 4. Predict Stone
export const predictStone = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosInstance.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// 5. Get All Reports
export const getAllReports = async () => {
  const response = await axiosInstance.get('/reports');
  return response.data;
};

// 6. Optional logout helper
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};

// Default export
const api = {
  registerUser,
  loginUser,
  getProfile,
  predictStone,
  getAllReports,
  logoutUser,
};

export default api;