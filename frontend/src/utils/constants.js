export const ROLES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  STAFF: 'staff',
  ADMIN: 'admin'
};

export const REPORT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// Frontend එකේ පාවිච්චි වන වර්ණ කේත (Colors)
export const STATUS_COLORS = {
  DANGER: '#dc3545',  // රතු (ගල් තියෙනවා නම්)
  SUCCESS: '#28a745', // කොළ (සෞඛ්‍ය සම්පන්න නම්)
  WARNING: '#ffc107', // කහ
  INFO: '#17a2b8'     // නිල්
};

// File Upload සීමාවන්
export const FILE_CONFIG = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg']
};