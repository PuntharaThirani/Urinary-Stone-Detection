const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users/me
// @desc    Get current logged in user details
router.get('/me', auth, userController.getMe);

// @route   GET api/users
// @desc    Get all users (Admin/Staff only)
router.get('/', auth, userController.getAllUsers);

module.exports = router;