const { check, validationResult } = require('express-validator');

// ===============================
// REGISTER VALIDATION
// ===============================
exports.registerValidation = [
  // Name — required, min 2 chars
  check('name', 'Name is required')
    .not()
    .isEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  // Email — valid format
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail(),

  // Password — min 6 chars
  check('password', 'Password must be at least 6 characters')
    .isLength({ min: 6 }),

  // Role — optional, must be valid role
  check('role')
    .optional()
    .isIn(['doctor', 'patient', 'staff'])
    .withMessage('Invalid role — must be doctor, patient or staff'),

  // Phone number — optional, valid format
  check('phoneNumber')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
];

// ===============================
// LOGIN VALIDATION
// ===============================
exports.loginValidation = [
  // Email — valid format
  check('email', 'Please include a valid email')
    .isEmail()
    .normalizeEmail(),

  // Password — required
  check('password', 'Password is required')
    .not()
    .isEmpty(),
];

// ===============================
// REPORT VALIDATION
// ===============================
exports.reportValidation = [
  check('doctorId', 'Doctor ID is required')
    .not()
    .isEmpty(),

  check('imageId', 'Image ID is required')
    .not()
    .isEmpty(),

  check('imagePath', 'Image path is required')
    .not()
    .isEmpty(),
];

// ===============================
// APPOINTMENT VALIDATION
// ===============================
exports.appointmentValidation = [
  check('patientId', 'Patient ID is required')
    .not()
    .isEmpty(),

  check('doctorId', 'Doctor ID is required')
    .not()
    .isEmpty(),

  check('appointmentDate', 'Valid appointment date is required')
    .not()
    .isEmpty()
    .isISO8601()
    .withMessage('Date must be in valid format'),

  check('timeSlot', 'Time slot is required')
    .not()
    .isEmpty(),
];

// ===============================
// PATIENT VALIDATION
// ===============================
exports.patientValidation = [
  check('fullName', 'Full name is required')
    .not()
    .isEmpty()
    .trim(),

  check('patientId', 'Patient ID is required')
    .not()
    .isEmpty(),

  check('age', 'Valid age is required')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),

  check('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female or other'),

  check('contactNumber')
    .optional()
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Contact number must be 10-15 digits'),
];

// ===============================
// COMMON VALIDATION HANDLER
// ===============================
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Get first error message
    const firstError = errors.array()[0];

    return res.status(400).json({
      success: false,
      message: firstError.msg || 'Validation failed',
      errors:  errors.array(),
    });
  }

  next();
};