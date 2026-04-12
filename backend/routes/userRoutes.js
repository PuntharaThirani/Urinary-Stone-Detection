const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

// ===============================
// USER ROUTES
// ===============================

// @route   GET /api/users/me
// @desc    Get logged-in user profile
// @access  All authenticated users
router.get('/me', auth, userController.getMe);

// @route   GET /api/users
// @desc    Get all users
// @access  Staff only
router.get(
  '/',
  auth,
  allowRoles('staff'),
  userController.getAllUsers
);

// @route   GET /api/users/doctors
// @desc    Get all doctors
// @access  Staff
router.get(
  '/doctors',
  auth,
  allowRoles('staff'),
  userController.getDoctors
);

// @route   GET /api/users/patients
// @desc    Get all patients
// @access  Doctor / Staff
router.get(
  '/patients',
  auth,
  allowRoles('doctor', 'staff'),
  userController.getPatients
);

module.exports = router;