const express    = require('express');
const cors       = require('cors');
const fs         = require('fs');
const path       = require('path');
const dotenv     = require('dotenv');
const connectDB  = require('./config/database');

// Load env first — before anything else
dotenv.config(); 

// Routes
const predictionRoutes  = require('./routes/predictionRoutes');
const authRoutes        = require('./routes/authRoutes');
const reportRoutes      = require('./routes/reportRoutes');
const userRoutes        = require('./routes/userRoutes');
const uploadRoutes      = require('./routes/uploadRoutes');
const patientRoutes     = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes       = require('./routes/adminRoutes');

const Patient = require('./models/Patient');
const User = require('./models/User');

const errorHandler = require('./middleware/errorHandler');

// Connect database
connectDB();

const Report = require('./models/Report');

setTimeout(async () => {

  try {

    await Report.collection.dropIndex(
      'reportNumber_1'
    );

    console.log(
      '✅ reportNumber index removed'
    );

  } catch (err) {

    console.log(
      'ℹ️ reportNumber index already removed'
    );

  }

}, 3000);

const app = express();
const port = process.env.PORT || 5000;

// REMOVE OLD doctorCode INDEX
setTimeout(async () => {
  try {

    await User.collection.dropIndex(
      'doctorCode_1'
    );

    console.log(
      '✅ Old doctorCode index removed'
    );

  } catch (err) {

    console.log(
      'ℹ️ doctorCode index already removed'
    );

  }
}, 3000);

// Middleware

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Static Files

app.use('/uploads', express.static(
  path.join(__dirname, 'uploads')
));


// Check AI Models on Startup

const modelsToCheck = [
  {
    path: path.join(__dirname, 'AI_Models', 'Detection.pt'),
    name: 'Detection.pt (YOLOv8)',
  },
  {
    path: path.join(__dirname, 'AI_Models', 'efficientnet_b0_kidney_stone.pth'),
    name: 'EfficientNet-B0',
  },
];

modelsToCheck.forEach(({ path: modelPath, name }) => {
  if (!fs.existsSync(modelPath)) {
    console.error(`❌ WARNING: ${name} missing!`);
  } else {
    console.log(`✅ ${name} found!`);
  }
});


// API Routes

app.use('/api/auth',         authRoutes);
app.use('/api/predict',      predictionRoutes);
app.use('/api/reports',      reportRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/upload',       uploadRoutes);
app.use('/api/patients',     patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin',        adminRoutes);


// Health Check

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ UroScan AI — Diagnosis Support System API',
    version: '1.0.0',
    status:  'running',
    endpoints: {
      auth:         '/api/auth',
      predict:      '/api/predict',
      reports:      '/api/reports',
      users:        '/api/users',
      upload:       '/api/upload',
      patients:     '/api/patients',
      appointments: '/api/appointments',
      admin:        '/api/admin',
    },
  });
});


// 404 Handler

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


// Global Error Handler

app.use(errorHandler);


// Start Server

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log(`📁 Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Client URL  : ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    console.log(`🗄️  Database    : Connected\n`);
  });
}

module.exports = app;