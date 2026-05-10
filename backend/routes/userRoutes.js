const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const allowRoles = require('../middleware/role');

const userController = require('../controllers/userController');

// Get logged-in user profile — all authenticated users
router.get('/me',
  auth,
  userController.getMe
);

// Update own profile — all authenticated users 
router.put('/me',
  auth,
  userController.updateProfile
);

// Get all users — staff, admin
router.get('/',
  auth,
  allowRoles('staff', 'admin'), //  Admin added
  userController.getAllUsers
);

// Get all doctors — staff, patient, admin
router.get('/doctors',
  auth,
  allowRoles('staff', 'patient', 'admin'), //  Patient added
  userController.getDoctors
);

// Get all patients — doctor, staff, admin
router.get('/patients',
  auth,
  allowRoles('doctor', 'staff', 'admin'), //  Admin added
  userController.getPatients
);

module.exports = router;