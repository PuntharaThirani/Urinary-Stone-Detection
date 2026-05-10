import {
  getAllReports,
  getMyReports,
  getMyFinalReports,
  getReportById,
  getReportsByPatientId,
  createDraftReport,
  confirmReport,
  rejectReport,
  editDraftReport,
  deleteReport,
} from './api';

const reportService = {
  // Get all reports — Doctor/Admin
  getAllReports: async () => {
    try {
      return await getAllReports();
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get doctor's own reports
  getMyReports: async () => {
    try {
      return await getMyReports();
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get patient's confirmed reports
  getMyFinalReports: async () => {
    try {
      return await getMyFinalReports();
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get report by ID
  getReportById: async (id) => {
    try {
      return await getReportById(id);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get reports by patient ID
  getReportsByPatientId: async (patientId) => {
    try {
      return await getReportsByPatientId(patientId);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Create AI draft report
  createDraftReport: async (reportData) => {
    try {
      return await createDraftReport(reportData);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Doctor confirm report
  confirmReport: async (id, data) => {
    try {
      return await confirmReport(id, data);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Doctor reject report
  rejectReport: async (id) => {
    try {
      return await rejectReport(id);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Edit draft report
  editDraftReport: async (id, data) => {
    try {
      return await editDraftReport(id, data);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Delete report — Admin only
  deleteReport: async (id) => {
    try {
      return await deleteReport(id);
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

export default reportService;