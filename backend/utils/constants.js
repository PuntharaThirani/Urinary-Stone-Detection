// User Roles

const ROLES = {
  ADMIN:   'admin',
  DOCTOR:  'doctor',
  PATIENT: 'patient',
  STAFF:   'staff',
};


// Report Status
// Must match Report model enum exactly

const REPORT_STATUS = {
  PENDING:      'pending',       // AI analyzed, awaiting doctor
  UNDER_REVIEW: 'under_review',  // Doctor reviewing
  CONFIRMED:    'confirmed',     // Doctor confirmed
  REJECTED:     'rejected',      // Doctor rejected
};


// Allowed File Types for X-ray Upload

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
];


// Allowed File Extensions

const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
];


// Token Settings

const TOKEN_EXPIRY = '1d'; // 1 day — matches authController


// File Upload Settings

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


// AI Model Settings

const AI_CONFIDENCE_THRESHOLD = 0.5; // Minimum confidence


// Pagination Defaults

const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
};


// Exports

module.exports = {
  ROLES,
  REPORT_STATUS,
  ALLOWED_FILE_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  TOKEN_EXPIRY,
  AI_CONFIDENCE_THRESHOLD,
  PAGINATION,
};