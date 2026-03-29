import { FILE_CONFIG } from './constants';

/**
 * 1. Email එක නිවැරදිදැයි බැලීම (Regex)
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * 2. Password එකේ ශක්තිමත්බව බැලීම
 * (අවම අකුරු 6ක් තිබිය යුතුයි)
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * 3. Upload කරන File එක පරීක්ෂා කිරීම
 * (පින්තූරයක්ද? 5MB ට අඩුද?)
 */
export const validateFile = (file) => {
  // ගොනුවක් තෝරාගෙන ඇත්දැයි බැලීම
  if (!file) {
    return { valid: false, message: "Please select a file." };
  }

  // වර්ගය පරීක්ෂා කිරීම (Images only)
  if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, message: "Invalid file type. Please upload JPG or PNG." };
  }

  // ප්‍රමාණය පරීක්ෂා කිරීම (Size Limit)
  if (file.size > FILE_CONFIG.MAX_SIZE_BYTES) {
    return { valid: false, message: `File size too large. Max limit is ${FILE_CONFIG.MAX_SIZE_MB}MB.` };
  }

  return { valid: true };
};