const User = require('../models/User');
const Patient = require('../models/Patient');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');


// REGISTER

exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      patientId,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {

      return res.status(400).json({

        success: false,

        message:
          'Name, email and password are required',

      });
    }

    logger.info(
      `User registration attempt: ${email}`
    );

    // Check existing user
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      logger.warn(
        `User already exists: ${email}`
      );

      return res.status(400).json({

        success: false,

        message:
          'User already exists',

      });
    }

    // Safe roles only
    const publicRoles = [

      ROLES.DOCTOR,
      ROLES.PATIENT,
      ROLES.STAFF,

    ];

    const safeRole =
      publicRoles.includes(role)
        ? role
        : ROLES.PATIENT;

    // Generate doctor ID
    let doctorId = undefined;

    if (
      safeRole === ROLES.DOCTOR
    ) {

      const doctorCount =
        await User.countDocuments({

          role: ROLES.DOCTOR,

        });

      doctorId =
        `DOC-${String(
          doctorCount + 1
        ).padStart(4, '0')}`;
    }

    // VALIDATE PATIENT FIRST
    let patient = null;

    if (
      safeRole === ROLES.PATIENT
    ) {

      // Patient ID required
      if (!patientId) {

        return res.status(400).json({

          success: false,

          message:
            'Patient ID is required',

        });
      }

      // Find patient record
      patient =
        await Patient.findOne({

          patientId:
            patientId.trim(),
        });

      // Invalid patient ID
      if (!patient) {

        return res.status(404).json({

          success: false,

          message:
            'Invalid Patient ID',

        });
      }

      // Prevent duplicate linking
      if (patient.userId) {

        return res.status(400).json({

          success: false,

          message:
            'Patient account already linked',

        });
      }
    }

    // CREATE USER
    const user = new User({

      name,

      email:
        email.toLowerCase(),

      password,

      role: safeRole,

      doctorId,

    });

    await user.save();

    // LINK PATIENT ACCOUNT
    if (
      safeRole === ROLES.PATIENT &&
      patient
    ) {

      patient.userId = user._id;

      patient.email = email;

      await patient.save();

      logger.success(
        `Patient linked: ${patientId}`
      );
    }

    logger.success(
      `User registered successfully: ${email}`
    );

    return res.status(201).json({

      success: true,

      message:
        'User registered successfully',

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        doctorId:
          user.doctorId || null,

      },

    });

  } catch (error) {

    logger.error(
      'Registration Error',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Registration failed',

      error: error.message,

    });
  }
};


// LOGIN

exports.login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // Validation
    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message:
          'Email and password are required',

      });
    }

    logger.info(
      `Login attempt: ${email}`
    );

    // Find user
    const user =
      await User.findOne({

        email:
          email.toLowerCase(),
      });

    if (!user) {

      logger.warn(
        `Invalid email: ${email}`
      );

      return res.status(400).json({

        success: false,

        message:
          'Invalid credentials',

      });
    }

    // Active account check
    if (!user.isActive) {

      return res.status(403).json({

        success: false,

        message:
          'Account is deactivated. Please contact admin.',

      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      logger.warn(
        `Invalid password for: ${email}`
      );

      return res.status(400).json({

        success: false,

        message:
          'Invalid credentials',

      });
    }

    // Update last login
    user.lastLogin =
      new Date();

    await user.save();

    // JWT payload
    const payload = {

      id: user._id,

      role: user.role,

    };

    // Generate token
    const token = jwt.sign(

      payload,

      process.env.JWT_SECRET,

      {
        expiresIn: '1d',
      }
    );

    logger.success(
      `User logged in: ${email}`
    );

    return res.status(200).json({

      success: true,

      token,

      role: user.role,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        doctorId:
          user.doctorId || null,

        lastLogin:
          user.lastLogin,
      },
    });

  } catch (error) {

    logger.error(
      'Login Error',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Login failed',

      error: error.message,

    });
  }
};


// GET PROFILE

exports.getProfile = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      ).select('-password');

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          'User not found',

      });
    }

    return res.status(200).json({

      success: true,

      user,

    });

  } catch (error) {

    logger.error(
      'Profile Error',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Failed to fetch profile',

      error: error.message,

    });
  }
};


// LOGOUT

exports.logout = async (req, res) => {

  try {

    logger.success(
      `User logged out: ${req.user?.id}`
    );

    return res.status(200).json({

      success: true,

      message:
        'Logged out successfully',

    });

  } catch (error) {

    logger.error(
      'Logout Error',
      error
    );

    return res.status(500).json({

      success: false,

      message:
        'Logout failed',

      error: error.message,

    });
  }
};