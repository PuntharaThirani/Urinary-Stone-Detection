import { FILE_CONFIG } from './constants';

// Validate Email

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Validate Password — min 6 chars

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validate File — type + size

export const validateFile = (file) => {
  if (!file) {
    return { valid: false, message: 'Please select a file.' };
  }

  if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid:   false,
      message: 'Invalid file type. Please upload JPG or PNG only.',
    };
  }

  if (file.size > FILE_CONFIG.MAX_SIZE_BYTES) {
    return {
      valid:   false,
      message: `File too large. Maximum size is ${FILE_CONFIG.MAX_SIZE_MB}MB.`,
    };
  }

  return { valid: true, message: '' };
};

// Validate Name — min 2 chars 

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters.' };
  }
  return { valid: true, message: '' };
};

// Validate Phone Number 

export const validatePhone = (phone) => {
  const re = /^[0-9]{10,15}$/;
  if (!phone) return { valid: true, message: '' }; // optional
  if (!re.test(phone)) {
    return { valid: false, message: 'Phone number must be 10-15 digits.' };
  }
  return { valid: true, message: '' };
};

// Validate Age 

export const validateAge = (age) => {
  const num = Number(age);
  if (!age) return { valid: true, message: '' }; // optional
  if (isNaN(num) || num < 0 || num > 150) {
    return { valid: false, message: 'Age must be between 0 and 150.' };
  }
  return { valid: true, message: '' };
};

// Validate Register Form 

export const validateRegisterForm = (formData) => {
  const errors = {};

  const nameCheck  = validateName(formData.name);
  const emailCheck = { valid: validateEmail(formData.email), message: 'Invalid email address.' };
  const passCheck  = { valid: validatePassword(formData.password), message: 'Password must be at least 6 characters.' };

  if (!nameCheck.valid) errors.name = nameCheck.message;
  if (!emailCheck.valid) errors.email  = emailCheck.message;
  if (!passCheck.valid) errors.password = passCheck.message;

  return {
    valid:  Object.keys(errors).length === 0,
    errors,
  };
};