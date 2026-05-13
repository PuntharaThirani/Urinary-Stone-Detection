const express = require('express');

const router = express.Router();

const auth =
  require('../middleware/auth');

const allowRoles =
  require('../middleware/role');

const userController =
  require('../controllers/userController');


// =========================
// GET LOGGED-IN USER
// =========================

router.get(
  '/me',

  auth,

  userController.getMe
);


// =========================
// GET LOGGED-IN
// PATIENT PROFILE
// =========================

router.get(
  '/my-patient-profile',

  auth,

  userController.getMyPatientProfile
);


// =========================
// UPDATE OWN PROFILE
// =========================

router.put(
  '/me',

  auth,

  userController.updateProfile
);


// =========================
// GET ALL USERS
// STAFF + ADMIN
// =========================

router.get(
  '/',

  auth,

  allowRoles(
    'staff',
    'admin'
  ),

  userController.getAllUsers
);


// =========================
// GET ALL DOCTORS
// STAFF + PATIENT + ADMIN
// =========================

router.get(
  '/doctors',

  auth,

  allowRoles(
    'staff',
    'patient',
    'admin'
  ),

  userController.getDoctors
);


// =========================
// GET ALL PATIENTS
// DOCTOR + STAFF + ADMIN
// =========================

router.get(
  '/patients',

  auth,

  allowRoles(
    'doctor',
    'staff',
    'admin'
  ),

  userController.getPatients
);

module.exports = router;