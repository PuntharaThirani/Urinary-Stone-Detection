const crypto = require('crypto');


// Format Date — "2026-02-04"

const formatDate = (date) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toISOString().split('T')[0];
  } catch {
    return 'Invalid Date';
  }
};


// Format Date Time — "2026-02-04 14:30:00"

const formatDateTime = (date) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toISOString()
      .replace('T', ' ')
      .substring(0, 19);
  } catch {
    return 'Invalid Date';
  }
};


// Generate Secure Random ID
// Uses crypto for security

const generateRandomId = (length = 10) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase();
};


// Generate Patient ID
// Format: PT-2026-XXXXXX

const generatePatientId = () => {
  const year = new Date().getFullYear();
  const random = generateRandomId(6);
  return `PT-${year}-${random}`;
};


// Sleep / Delay
// Usage: await sleep(1000) — wait 1 second

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


// Normalize File Path
// Converts backslashes to forward slashes

const normalizePath = (filePath) => {
  return filePath ? filePath.replace(/\\/g, '/') : '';
};


// Sanitize String
// Remove special characters

const sanitizeString = (str) => {
  if (!str) return '';
  return str
    .trim()
    .replace(/[<>{}]/g, '');
};


// Paginate Results

const getPagination = (page = 1, limit = 20) => {
  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};


// Exports

module.exports = {
  formatDate,
  formatDateTime,
  generateRandomId,
  generatePatientId,
  sleep,
  normalizePath,
  sanitizeString,
  getPagination,
};