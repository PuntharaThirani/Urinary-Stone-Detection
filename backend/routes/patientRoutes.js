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
  getMyPatientProfile, // ✅ NEW
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

// ✅ Get logged-in patient's own profile
router.get('/my-profile',
  auth,
  allowRoles('patient'),
  getMyPatientProfile
);

// Create patient — staff, doctor, admin
router.post('/',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  createPatient
);

// Get all patients
router.get('/',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  getAllPatients
);

// Get by ID
router.get('/:id',
  auth,
  allowRoles('staff', 'doctor', 'patient', 'admin'),
  getPatientById
);

// Update
router.put('/:id',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  updatePatient
);

// Delete — admin only
router.delete('/:id',
  auth,
  allowRoles('admin'),
  deletePatient
);

module.exports = router;