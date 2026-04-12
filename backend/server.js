const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Routes
const predictionRoutes = require('./routes/predictionRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const errorHandler = require('./middleware/errorHandler');

// Load env
dotenv.config();

// Connect database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check AI model
const modelPath = path.join(__dirname, 'AI_Models', 'best.pt');
if (!fs.existsSync(modelPath)) {
  console.error('❌ WARNING: best.pt missing in AI_Models folder!');
} else {
  console.log('✅ best.pt found!');
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('✅ Urinary Stone Detection API is Running');
});

// Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

module.exports = app;