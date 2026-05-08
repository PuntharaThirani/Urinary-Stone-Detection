const errorHandler = (err, req, res, next) => {
  // Log error to console
  console.error(`❌ ERROR: ${err.message}`);

  let statusCode = 500;
  let message    = err.message || 'Server Error';

  // Fix status code if already set
  if (res.statusCode && res.statusCode !== 200) {
    statusCode = res.statusCode;
  }

  // ===========================
  // MONGOOSE BAD OBJECT ID
  // ===========================
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = `Invalid ID format: ${err.value}`;
  }

  // ===========================
  // MONGOOSE VALIDATION ERROR
  // ===========================
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // ===========================
  // DUPLICATE KEY (email etc.)
  // ===========================
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists`;
  }

  // ===========================
  // JWT ERRORS
  // ===========================
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token expired, please login again';
  }

  // ===========================
  // MULTER FILE SIZE ERROR
  // ===========================
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message    = 'File size too large. Maximum 5MB allowed';
  }

  // ===========================
  // MULTER FILE TYPE ERROR
  // ===========================
  if (err.message === 'Only JPG, JPEG, PNG images are allowed') {
    statusCode = 400;
    message    = err.message;
  }

  // ===========================
  // FINAL RESPONSE
  // ===========================
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack 
    }),
  });
};

module.exports = errorHandler;