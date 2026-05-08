const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Routes
const predictionRoutes   = require('./routes/predictionRoutes');
const authRoutes         = require('./routes/authRoutes');
const reportRoutes       = require('./routes/reportRoutes');
const userRoutes         = require('./routes/userRoutes');
const uploadRoutes       = require('./routes/uploadRoutes');
const patientRoutes      = require('./routes/patientRoutes');
const appointmentRoutes  = require('./routes/appointmentRoutes');
const adminRoutes        = require('./routes/adminRoutes'); // ✅ NEW

const errorHandler = require('./middleware/errorHandler');

// Load env
dotenv.config();

// Connect database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===============================
// Static Files — Uploaded Images
// ===============================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================
// Check AI Models
// ===============================
const detectionModelPath  = path.join(__dirname, 'AI_Models', 'Detection.pt');
const classifierModelPath = path.join(__dirname, 'AI_Models', 'efficientnet_b0_kidney_stone.pth');

if (!fs.existsSync(detectionModelPath)) {
  console.error('❌ WARNING: Detection.pt missing in AI_Models folder!');
} else {
  console.log('✅ Detection.pt found!');
}

if (!fs.existsSync(classifierModelPath)) {
  console.error('❌ WARNING: efficientnet_b0_kidney_stone.pth missing in AI_Models folder!');
} else {
  console.log('✅ EfficientNet model found!');
}

// ===============================
// API Routes
// ===============================
app.use('/api/auth',         authRoutes);
app.use('/api/predict',      predictionRoutes);
app.use('/api/reports',      reportRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/upload',       uploadRoutes);
app.use('/api/patients',     patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin',        adminRoutes); // ✅ NEW

// ===============================
// Health Check Route
// ===============================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ Urinary Stone Detection API is Running',
    version: '1.0.0',
    endpoints: {
      auth:         '/api/auth',
      predict:      '/api/predict',
      reports:      '/api/reports',
      users:        '/api/users',
      upload:       '/api/upload',
      patients:     '/api/patients',
      appointments: '/api/appointments',
      admin:        '/api/admin',       // ✅ NEW
    },
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===============================
// Error Handler
// ===============================
app.use(errorHandler);

// ===============================
// Start Server
// ===============================
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  });
}

module.exports = app;