const errorHandler = (err, req, res, next) => {
  console.error(`❌ ERROR: ${err.message}`);

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // =========================
  // MONGOOSE BAD OBJECT ID
  // =========================
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // =========================
  // DUPLICATE KEY (e.g., email)
  // =========================
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // =========================
  // JWT ERRORS
  // =========================
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // =========================
  // FINAL RESPONSE
  // =========================
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;