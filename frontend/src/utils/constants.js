// User Roles

export const ROLES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  STAFF: 'staff',
  ADMIN: 'admin',
};

// Report Status — must match backend model

export const REPORT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
};

// Status Colors — Tailwind compatible

export const STATUS_COLORS = {
  DANGER: '#ef4444',  // Stone detected
  SUCCESS: '#22c55e',  // No stone
  WARNING: '#f59e0b',  // Pending
  INFO: '#3b82f6',  // Info
  PURPLE:'#8b5cf6',  // Phase 1
};

// File Upload Config

export const FILE_CONFIG = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_EXT: ['.jpg', '.jpeg', '.png'],
};

// API Base URL

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Dashboard Paths by Role

export const DASHBOARD_PATHS = {
  doctor: '/doctor-dashboard',
  patient: '/patient-dashboard',
  staff: '/staff-dashboard',
  admin: '/admin',
};

// Pagination

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_PAGE: 1,
};