const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  validate,
} = require('../middleware/validation');

// ===============================
// AUTH ROUTES
// ===============================

// Register
router.post(
  '/register',
  registerValidation,
  validate,
  authController.register
);

// Login
router.post(
  '/login',
  loginValidation,
  validate,
  authController.login
);

// Get logged-in user profile
router.get('/profile', auth, authController.getProfile);

// Verify token
router.get('/verify', auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: req.user,
  });
});

module.exports = router;