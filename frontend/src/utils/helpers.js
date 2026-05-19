import { STATUS_COLORS, REPORT_STATUS } from './constants';

// Format Date — "Feb 3, 2026"

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format Date + Time — "Feb 3, 2026 at 10:30 AM"

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = {
    year:'numeric',
    month:'short',
    day:  'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Truncate Long Text

export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get Status Color by Stone Result

export const getStatusColor = (hasStones) => {
  return hasStones ? STATUS_COLORS.DANGER : STATUS_COLORS.SUCCESS;
};

// Capitalize First Letter

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get Report Status Badge Class 

export const getReportStatusClass = (status) => {
  const classes = {
    [REPORT_STATUS.CONFIRMED]:'bg-emerald-100 text-emerald-700',
    [REPORT_STATUS.REJECTED]: 'bg-red-100 text-red-700',
    [REPORT_STATUS.UNDER_REVIEW]: 'bg-purple-100 text-purple-700',
    [REPORT_STATUS.PENDING]:'bg-amber-100 text-amber-700',
  };
  return classes[status] || 'bg-slate-100 text-slate-700';
};

// Format File Size 

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024)  return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Shorten MongoDB ObjectId 

export const shortId = (id, length = 8) => {
  if (!id) return 'N/A';
  return `#${id.substring(0, length)}`;
};

// Get Role Dashboard Path 

export const getDashboardPath = (role) => {
  const paths = {
    doctor: '/doctor-dashboard',
    patient: '/patient-dashboard',
    staff: '/staff-dashboard',
    admin: '/admin',
  };
  return paths[role] || '/login';
};