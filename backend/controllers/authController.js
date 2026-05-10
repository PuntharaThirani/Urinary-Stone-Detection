const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');


// REGISTER

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    logger.info(`User registration attempt: ${email}`);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`User already exists: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Prevent role injection
    // Admin role cannot be self-registered
    const publicRoles = [ROLES.DOCTOR, ROLES.PATIENT, ROLES.STAFF];
    const safeRole    = publicRoles.includes(role)
      ? role
      : ROLES.PATIENT;

    // Create new user — password hashed by pre-save hook
    const user = new User({
      name,
      email,
      password, // plain text — model will hash it
      role: safeRole,
    });

    await user.save();

    logger.success(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    logger.error('Registration Error', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error:   error.message,
    });
  }
};


// LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    logger.info(`Login attempt: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Invalid email: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active 
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid password for: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login time 
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      id:   user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    logger.success(`User logged in: ${email}`);

    // Send response
    res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        doctorId:   user.doctorId, 
        patientId:  user.patientId,
        lastLogin: user.lastLogin, 
      },
    });
  } catch (error) {
    logger.error('Login Error', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error:   error.message,
    });
  }
};


// GET PROFILE

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Profile Error', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error:   error.message,
    });
  }
};


// LOGOUT (Clear client token)

exports.logout = async (req, res) => {
  try {
    // JWT stateless — client side token clear කරනවා
    // Frontend localStorage clear කරනවා
    logger.success(`User logged out: ${req.user?.id}`);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout Error', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error:   error.message,
    });
  }
};