const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { ROLES } = require('../utils/constants');

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    logger.info(`User registration attempt: ${email}`);

    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔥 prevent role injection
    const safeRole = Object.values(ROLES).includes(role)
      ? role
      : ROLES.PATIENT;

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    await user.save();

    logger.success(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    logger.error('Registration Error', error);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    logger.info(`Login attempt: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Invalid email: ${email}`);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid password: ${email}`);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 🔥 IMPORTANT PAYLOAD
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    logger.success(`User logged in: ${email}`);

    res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login Error', error);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error('Profile Error', error);
    res.status(500).json({ error: error.message });
  }
};