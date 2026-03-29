// වෙලාව ගන්න පොඩි උදව්වක්
const getTimestamp = () => {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

const logger = {
    // සාමාන්‍ය තොරතුරු
    info: (message) => {
        console.log(`ℹ️  [INFO] [${getTimestamp()}]: ${message}`);
    },

    // සාර්ථක වූ දේවල්
    success: (message) => {
        console.log(`✅ [SUCCESS] [${getTimestamp()}]: ${message}`);
    },

    // අනතුරු ඇඟවීම්
    warn: (message) => {
        console.warn(`⚠️ [WARN] [${getTimestamp()}]: ${message}`);
    },

    // දෝෂ (Errors)
    error: (message, error = '') => {
        console.error(`❌ [ERROR] [${getTimestamp()}]: ${message}`, error);
    }
};

module.exports = logger;