const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// Create AI draft
router.post(
  '/draft',
  auth,
  allowRoles('doctor'),
  reportController.createDraftReport
);

// Confirm report
router.put(
  '/:id/confirm',
  auth,
  allowRoles('doctor'),
  reportController.confirmReport
);

// Patient finalized reports
router.get(
  '/my/final',
  auth,
  allowRoles('patient'),
  reportController.getMyFinalReports
);

// Reports by patient ID
router.get(
  '/patient/:patientId',
  auth,
  allowRoles('doctor', 'staff'),
  reportController.getReportsByPatientId
);

// All reports
router.get(
  '/',
  auth,
  allowRoles('doctor', 'staff'),
  reportController.getAllReports
);

// Single report by ID
router.get(
  '/:id',
  auth,
  reportController.getReportById
);

module.exports = router;