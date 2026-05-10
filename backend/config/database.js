const mongoose = require('mongoose');
const logger   = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI, // MONGODB_URI
      { autoIndex: true }
    );

    logger.success(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;