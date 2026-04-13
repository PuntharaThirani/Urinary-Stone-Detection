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

// ======================================
// AUTH
// ======================================

// Register User
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);

    const role = response.data.role || response.data.user?.role || '';
    if (role) {
      localStorage.setItem('userRole', role);
    }
  }

  return response.data;
};

// Get Logged-in User Profile
export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};

// Verify Token
export const verifyToken = async () => {
  const response = await axiosInstance.get('/auth/verify');
  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};

// ======================================
// UPLOAD + PREDICTION
// ======================================

// Step 1: Upload X-ray Image
export const uploadXray = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Step 2: Predict using uploaded file path
export const predictStone = async (imagePath) => {
  const response = await axiosInstance.post('/predict', {
    imagePath,
  });

  return response.data;
};

// Combined helper: Upload + Predict
export const uploadAndPredict = async (file) => {
  const uploadResponse = await uploadXray(file);

  const uploadedPath =
    uploadResponse?.image?.filePath ||
    uploadResponse?.filePath ||
    '';

  if (!uploadedPath) {
    throw new Error('Uploaded image path not found.');
  }

  const predictionResponse = await predictStone(uploadedPath);

  return {
    upload: uploadResponse,
    prediction: predictionResponse,
  };
};

// ======================================
// REPORTS
// ======================================

// Create draft report
export const createDraftReport = async (reportData) => {
  const response = await axiosInstance.post('/reports/draft', reportData);
  return response.data;
};

// Confirm report by doctor
export const confirmReport = async (reportId, reportData) => {
  const response = await axiosInstance.put(
    `/reports/${reportId}/confirm`,
    reportData
  );
  return response.data;
};

// Get all reports
export const getAllReports = async () => {
  const response = await axiosInstance.get('/reports');
  return response.data;
};

// Get report by ID
export const getReportById = async (reportId) => {
  const response = await axiosInstance.get(`/reports/${reportId}`);
  return response.data;
};

// Get reports by patient ID
export const getReportsByPatientId = async (patientId) => {
  const response = await axiosInstance.get(`/reports/patient/${patientId}`);
  return response.data;
};

// Get my finalized reports (patient)
export const getMyFinalReports = async () => {
  const response = await axiosInstance.get('/reports/my/final');
  return response.data;
};

// ======================================
// USERS
// ======================================

// Get all users
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

// Get current logged-in user
export const getMe = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// Get doctors
export const getDoctors = async () => {
  const response = await axiosInstance.get('/users/doctors');
  return response.data;
};

// Get patients
export const getPatients = async () => {
  const response = await axiosInstance.get('/users/patients');
  return response.data;
};

// ======================================
// PATIENTS
// ======================================

// Create patient
export const createPatient = async (patientData) => {
  const response = await axiosInstance.post('/patients', patientData);
  return response.data;
};

// Get all patients
export const getAllPatients = async () => {
  const response = await axiosInstance.get('/patients');
  return response.data;
};

// Get patient by ID
export const getPatientById = async (patientId) => {
  const response = await axiosInstance.get(`/patients/${patientId}`);
  return response.data;
};

// Update patient
export const updatePatient = async (patientId, patientData) => {
  const response = await axiosInstance.put(`/patients/${patientId}`, patientData);
  return response.data;
};

// Delete patient
export const deletePatient = async (patientId) => {
  const response = await axiosInstance.delete(`/patients/${patientId}`);
  return response.data;
};

// ======================================
// APPOINTMENTS
// ======================================

// Create appointment
export const createAppointment = async (appointmentData) => {
  const response = await axiosInstance.post('/appointments', appointmentData);
  return response.data;
};

// Get all appointments
export const getAllAppointments = async () => {
  const response = await axiosInstance.get('/appointments');
  return response.data;
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId) => {
  const response = await axiosInstance.get(`/appointments/${appointmentId}`);
  return response.data;
};

// Update appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  const response = await axiosInstance.put(
    `/appointments/${appointmentId}`,
    appointmentData
  );
  return response.data;
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  const response = await axiosInstance.delete(`/appointments/${appointmentId}`);
  return response.data;
};

// ======================================
// DEFAULT EXPORT
// ======================================

const api = {
  registerUser,
  loginUser,
  getProfile,
  verifyToken,
  logoutUser,

  uploadXray,
  predictStone,
  uploadAndPredict,

  createDraftReport,
  confirmReport,
  getAllReports,
  getReportById,
  getReportsByPatientId,
  getMyFinalReports,

  getAllUsers,
  getMe,
  getDoctors,
  getPatients,

  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,

  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};

export default api;