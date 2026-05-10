import axios from 'axios';

// Backend base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// Axios Instance

const axiosInstance = axios.create({
  baseURL: API_URL,
});


// Request Interceptor — Attach Token

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


// Response Interceptor — Handle 401

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// AUTH


export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);

  if (response.data.token) {
    const { token, role, user } = response.data;
    localStorage.setItem('token',    token);
    localStorage.setItem('userRole', role || user?.role || '');
    localStorage.setItem('userName', user?.name  || '');
    localStorage.setItem('userId',   user?.id    || user?._id || '');
  }

  return response.data;
};

// ✅ adminLogin — same as loginUser ඒත් admin role validate කරනවා
export const adminLogin = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);

  if (response.data.token) {
    const { token, role, user } = response.data;

    // ✅ Admin role check
    if (role !== 'admin' && user?.role !== 'admin') {
      throw { response: { data: { message: 'Unauthorized. Admin access only.' } } };
    }

    localStorage.setItem('token',    token);
    localStorage.setItem('userRole', role || user?.role || '');
    localStorage.setItem('userName', user?.name  || '');
    localStorage.setItem('userId',   user?.id    || user?._id || '');
  }

  return response.data;
};

export const getProfile  = async () => (await axiosInstance.get('/auth/profile')).data;
export const verifyToken = async () => (await axiosInstance.get('/auth/verify')).data;

export const logoutUser = () => {
  localStorage.clear();
};


// UPLOAD + PREDICTION


export const uploadXray = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const predictStone = async (imagePath) => {
  const response = await axiosInstance.post('/predict', { imagePath });
  return response.data;
};

export const uploadAndPredict = async (file) => {
  const uploadResponse = await uploadXray(file);
  const uploadedPath =
    uploadResponse?.image?.filePath ||
    uploadResponse?.filePath || '';

  if (!uploadedPath) throw new Error('Uploaded image path not found.');

  const predictionResponse = await predictStone(uploadedPath);
  return { upload: uploadResponse, prediction: predictionResponse };
};


// REPORTS


export const createDraftReport      = async (data)        => (await axiosInstance.post('/reports/draft',              data)).data;
export const confirmReport          = async (id, data)    => (await axiosInstance.put(`/reports/${id}/confirm`,       data)).data;
export const rejectReport           = async (id)          => (await axiosInstance.put(`/reports/${id}/reject`)).data;
export const editDraftReport        = async (id, data)    => (await axiosInstance.put(`/reports/${id}/edit`,          data)).data;
export const getAllReports          = async ()             => (await axiosInstance.get('/reports')).data;
export const getMyReports           = async ()             => (await axiosInstance.get('/reports/my')).data;
export const getMyFinalReports      = async ()             => (await axiosInstance.get('/reports/my/final')).data;
export const getReportById          = async (id)          => (await axiosInstance.get(`/reports/${id}`)).data;
export const getReportsByPatientId  = async (patientId)   => (await axiosInstance.get(`/reports/patient/${patientId}`)).data;
export const deleteReport           = async (id)          => (await axiosInstance.delete(`/reports/${id}`)).data;


// USERS


export const getAllUsers    = async ()       => (await axiosInstance.get('/users')).data;
export const getMe         = async ()       => (await axiosInstance.get('/users/me')).data;
export const getDoctors    = async ()       => (await axiosInstance.get('/users/doctors')).data;
export const getPatients   = async ()       => (await axiosInstance.get('/users/patients')).data;
export const updateProfile = async (data)  => (await axiosInstance.put('/users/me', data)).data;


// PATIENTS


export const createPatient  = async (data)     => (await axiosInstance.post('/patients',       data)).data;
export const getAllPatients  = async ()         => (await axiosInstance.get('/patients')).data;
export const getPatientById = async (id)       => (await axiosInstance.get(`/patients/${id}`)).data;
export const updatePatient  = async (id, data) => (await axiosInstance.put(`/patients/${id}`,  data)).data;
export const deletePatient  = async (id)       => (await axiosInstance.delete(`/patients/${id}`)).data;


// APPOINTMENTS


export const createAppointment  = async (data)     => (await axiosInstance.post('/appointments',       data)).data;
export const getAllAppointments  = async ()         => (await axiosInstance.get('/appointments')).data;
export const getAppointmentById = async (id)       => (await axiosInstance.get(`/appointments/${id}`)).data;
export const updateAppointment  = async (id, data) => (await axiosInstance.put(`/appointments/${id}`,  data)).data;
export const deleteAppointment  = async (id)       => (await axiosInstance.delete(`/appointments/${id}`)).data;


// ADMIN


export const getAdminStats     = async ()         => (await axiosInstance.get('/admin/stats')).data;
export const getAdminUsers     = async ()         => (await axiosInstance.get('/admin/users')).data;
export const updateUserRole    = async (id, role) => (await axiosInstance.put(`/admin/users/${id}/role`, { role })).data;
export const deleteAdminUser   = async (id)       => (await axiosInstance.delete(`/admin/users/${id}`)).data;
export const getAuditLogs      = async ()         => (await axiosInstance.get('/admin/audit-logs')).data;
export const getRecentActivity = async ()         => (await axiosInstance.get('/admin/recent-activity')).data;


// DEFAULT EXPORT

const api = axiosInstance;

api.registerUser          = registerUser;
api.loginUser             = loginUser;
api.adminLogin            = adminLogin; // ✅ New
api.getProfile            = getProfile;
api.verifyToken           = verifyToken;
api.logoutUser            = logoutUser;

api.uploadXray            = uploadXray;
api.predictStone          = predictStone;
api.uploadAndPredict      = uploadAndPredict;

api.createDraftReport     = createDraftReport;
api.confirmReport         = confirmReport;
api.rejectReport          = rejectReport;
api.editDraftReport       = editDraftReport;
api.getAllReports          = getAllReports;
api.getMyReports          = getMyReports;
api.getMyFinalReports     = getMyFinalReports;
api.getReportById         = getReportById;
api.getReportsByPatientId = getReportsByPatientId;
api.deleteReport          = deleteReport;

api.getAllUsers            = getAllUsers;
api.getMe                 = getMe;
api.getDoctors            = getDoctors;
api.getPatients           = getPatients;
api.updateProfile         = updateProfile;

api.createPatient         = createPatient;
api.getAllPatients         = getAllPatients;
api.getPatientById        = getPatientById;
api.updatePatient         = updatePatient;
api.deletePatient         = deletePatient;

api.createAppointment     = createAppointment;
api.getAllAppointments     = getAllAppointments;
api.getAppointmentById    = getAppointmentById;
api.updateAppointment     = updateAppointment;
api.deleteAppointment     = deleteAppointment;

api.getAdminStats         = getAdminStats;
api.getAdminUsers         = getAdminUsers;
api.updateUserRole        = updateUserRole;
api.deleteAdminUser       = deleteAdminUser;
api.getAuditLogs          = getAuditLogs;
api.getRecentActivity     = getRecentActivity;

export default api;