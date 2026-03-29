import api from './api';

const reportService = {
  // 1. සියලුම Reports ගැනීම (Doctor Dashboard එකට)
  getAllReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // 2. රෝගියෙකුගේ නම අනුව Reports ගැනීම (Patient Dashboard එකට)
  getPatientReports: async (patientName) => {
    try {
      const response = await api.get(`/reports/patient/${patientName}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // 3. අලුත් Report එකක් Save කිරීම (Prediction එකෙන් පස්සේ)
  saveReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default reportService;