const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const {
  patientValidation,
  validate,
} = require('../middleware/validation');

const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

// Create patient — staff, doctor, admin
router.post('/',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  patientValidation,  
  validate,           
  createPatient
);

// Get all patients — staff, doctor, admin
router.get('/',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  getAllPatients
);

// Get patient by ID — staff, doctor, patient, admin
router.get('/:id',
  auth,
  allowRoles('staff', 'doctor', 'patient', 'admin'),
  getPatientById
);

// Update patient — staff, doctor, admin
router.put('/:id',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  updatePatient
);

// Delete patient — admin only
router.delete('/:id',
  auth,
  allowRoles('admin'),  //  Admin only
  deletePatient
);

module.exports = router;