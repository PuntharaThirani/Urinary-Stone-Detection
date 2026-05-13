const User = require('../models/User');
const Patient = require('../models/Patient');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');

// ========================= REGISTER =========================

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, patientId } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    logger.info(`User registration attempt: ${normalizedEmail}`);

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const publicRoles = [ROLES.DOCTOR, ROLES.PATIENT, ROLES.STAFF];

    const safeRole = publicRoles.includes(role) ? role : ROLES.PATIENT;

    let doctorId = undefined;

    if (safeRole === ROLES.DOCTOR) {
      const doctorCount = await User.countDocuments({
        role: ROLES.DOCTOR,
      });

      doctorId = `DOC-${String(doctorCount + 1).padStart(4, '0')}`;
    }

    let patient = null;
    let finalName = name?.trim();

    if (safeRole === ROLES.PATIENT) {
      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID is required',
        });
      }

      const normalizedPatientId = patientId.trim().toUpperCase();

      patient = await Patient.findOne({
        patientId: normalizedPatientId,
        email: normalizedEmail,
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient record not found. Please contact hospital staff.',
        });
      }

      if (patient.userId) {
        return res.status(400).json({
          success: false,
          message: 'This patient already has an account.',
        });
      }

      finalName = patient.fullName;
    }

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const user = new User({
      name: finalName,
      email: normalizedEmail,
      password,
      role: safeRole,
      doctorId,
      patientId: patient?.patientId,
    });

    await user.save();

    if (patient) {
      patient.userId = user._id;
      await patient.save();

      logger.success(`Patient linked: ${patient.patientId}`);
    }

    logger.success(`User registered successfully: ${normalizedEmail}`);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: user.doctorId || null,
        patientId: user.patientId || null,
      },
    });
  } catch (error) {
    logger.error('Registration Error', error);

    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// ========================= LOGIN =========================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    logger.info(`Login attempt: ${normalizedEmail}`);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    logger.success(`User logged in: ${normalizedEmail}`);

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        doctorId: user.doctorId || null,
        patientId: user.patientId || null,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error('Login Error', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ========================= GET PROFILE =========================

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Profile Error', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

// ========================= LOGOUT =========================

exports.logout = async (req, res) => {
  try {
    logger.success(`User logged out: ${req.user?.id}`);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout Error', error);

    return res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};
