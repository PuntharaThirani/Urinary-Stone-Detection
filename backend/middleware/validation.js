const { check, validationResult } = require('express-validator');

// Register validation
exports.registerValidation = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('role')
    .optional()
    .isIn(['doctor', 'patient', 'staff'])
    .withMessage('Invalid role selected'),
];

// Login validation
exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').not().isEmpty(),
];

// Common validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
};