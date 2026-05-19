// Get current timestamp
const getTimestamp = () => {
  return new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);
};

const logger = {
  // General information
  info: (message) => {
    console.log(
      `ℹ️  [INFO]    [${getTimestamp()}]: ${message}`
    );
  },

  // Success messages
  success: (message) => {
    console.log(
      `✅ [SUCCESS] [${getTimestamp()}]: ${message}`
    );
  },

  // Warnings
  warn: (message) => {
    console.warn(
      `⚠️  [WARN]  [${getTimestamp()}]: ${message}`
    );
  },

  // Errors
  error: (message, error = '') => {
    console.error(
      `❌ [ERROR] [${getTimestamp()}]: ${message}`,
      error instanceof Error ? error.message : error
    );
  },

  // Database operations
  db: (message) => {
    console.log(
      `🗄️  [DB]  [${getTimestamp()}]: ${message}`
    );
  },

  // API requests
  api: (method, route, status) => {
    console.log(
      `🌐 [API] [${getTimestamp()}]: ${method} ${route} → ${status}`
    );
  },
};

module.exports = logger;