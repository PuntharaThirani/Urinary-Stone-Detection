const express = require('express');

const router = express.Router();

const allowRoles =
  require('../middleware/role');

const auth =
  require('../middleware/auth');

const reportController =
  require('../controllers/reportController');


// Create AI draft report — doctor only
router.post(
  '/draft',

  auth,

  allowRoles('doctor'),

  reportController.createDraftReport
);


// Get doctor's own reports
router.get(
  '/my',

  auth,

  allowRoles('doctor'),

  reportController.getMyReports
);


// Get logged-in patient's confirmed reports
router.get(
  '/my/final',

  auth,

  allowRoles('patient'),

  reportController.getMyFinalReports
);


// Get reports by patient ID
router.get(
  '/patient/:patientId',

  auth,

  allowRoles(
    'doctor',
    'staff',
    'admin'
  ),

  reportController.getReportsByPatientId
);


// Get all reports
router.get(
  '/',

  auth,

  allowRoles(
    'doctor',
    'staff',
    'admin'
  ),

  reportController.getAllReports
);


// Get single report by ID
router.get(
  '/:id',

  auth,

  allowRoles(
    'doctor',
    'staff',
    'patient',
    'admin'
  ),

  reportController.getReportById
);


// Confirm report
router.put(
  '/:id/confirm',

  auth,

  allowRoles('doctor'),

  reportController.confirmReport
);


// Edit draft report
router.put(
  '/:id/edit',

  auth,

  allowRoles('doctor'),

  reportController.editDraftReport
);


// Reject report
router.put(
  '/:id/reject',

  auth,

  allowRoles('doctor'),

  reportController.rejectReport
);


// Delete report
router.delete(
  '/:id',

  auth,

  allowRoles('admin'),

  reportController.deleteReport
);

module.exports = router;