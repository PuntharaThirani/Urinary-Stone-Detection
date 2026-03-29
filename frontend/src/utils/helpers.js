import { STATUS_COLORS } from './constants';

/**
 * 1. දිනය ලස්සනට පෙන්වීමට (Format Date)
 * උදා: "2026-02-03T10:00:00" -> "Feb 3, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * 2. වෙලාව එක්ක දිනය පෙන්වීමට
 * උදා: "Feb 3, 2026 at 10:30 AM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * 3. ගොඩක් දිග වචන කෙටි කිරීමට (Truncate)
 * උදා: ID එකක් දිග වැඩි නම්... "65a1b..." වගේ පෙන්නන්න
 */
export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * 4. ගල් තිබේද නැද්ද යන්න අනුව පාට තීරණය කිරීම
 */
export const getStatusColor = (hasStones) => {
  return hasStones ? STATUS_COLORS.DANGER : STATUS_COLORS.SUCCESS;
};

/**
 * 5. මුල් අකුර Capital කිරීම
 * උදා: "doctor" -> "Doctor"
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};