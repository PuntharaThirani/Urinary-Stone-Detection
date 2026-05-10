const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const authController = require('../controllers/authController');
const {
  registerValidation,
  loginValidation,
  validate,
} = require('../middleware/validation');

// Register new user
router.post('/register',
  registerValidation,
  validate,
  authController.register
);

// Login
router.post('/login',
  loginValidation,
  validate,
  authController.login
);

// Logout 
router.post('/logout',
  auth,
  authController.logout
);

// Get logged-in user profile
router.get('/profile',
  auth,
  authController.getProfile
);

// Verify token validity
router.get('/verify', auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user:    req.user,
  });
});

module.exports = router;