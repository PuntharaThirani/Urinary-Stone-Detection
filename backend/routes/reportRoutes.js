const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');

const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

console.log("CONTROLLER LOADED:", reportController);


// =====================================================
// Create AI Preliminary Draft Report
// =====================================================
router.post(
  '/draft',
  auth,
  allowRoles('doctor'),
  reportController.createDraftReport
);


// =====================================================
// Doctor Confirm Final Report
// =====================================================
router.put(
  '/:id/confirm',
  auth,
  allowRoles('doctor'),
  reportController.confirmReport
);


// =====================================================
// Doctor Edit Draft Report
// =====================================================
router.put(
  '/:id/edit',
  auth,
  allowRoles('doctor'),
  reportController.editDraftReport
);


// =====================================================
// Reject Report
// =====================================================
router.put(
  '/:id/reject',
  auth,
  allowRoles('doctor'),
  reportController.rejectReport
);


// =====================================================
// Get Logged-in Patient Finalized Reports
// =====================================================
router.get(
  '/my/final',
  auth,
  allowRoles('patient'),
  reportController.getMyFinalReports
);


// =====================================================
// Get Reports by Patient ID
// =====================================================
router.get(
  '/patient/:patientId',
  auth,
  allowRoles('doctor', 'staff'),
  reportController.getReportsByPatientId
);


// =====================================================
// Get All Reports
// =====================================================
router.get(
  '/',
  auth,
  allowRoles('doctor', 'staff'),
  reportController.getAllReports
);


// =====================================================
// Get Single Report
// =====================================================
router.get(
  '/:id',
  auth,
  reportController.getReportById
);


module.exports = router;