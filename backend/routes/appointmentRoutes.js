const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const {
  appointmentValidation,
  validate,
} = require('../middleware/validation');

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

// Create appointment — staff only
router.post('/',
  auth,
  allowRoles('staff', 'admin'),
  appointmentValidation,  // ✅ Added
  validate,               // ✅ Added
  createAppointment
);

// Get all appointments — staff, doctor, admin
router.get('/',
  auth,
  allowRoles('staff', 'doctor', 'admin'),
  getAllAppointments
);

// Get appointment by ID — staff, doctor, patient, admin
router.get('/:id',
  auth,
  allowRoles('staff', 'doctor', 'patient', 'admin'),
  getAppointmentById
);

// Update appointment — staff, admin
router.put('/:id',
  auth,
  allowRoles('staff', 'admin'),
  updateAppointment
);

// Delete appointment — staff, admin
router.delete('/:id',
  auth,
  allowRoles('staff', 'admin'),
  deleteAppointment
);

module.exports = router;