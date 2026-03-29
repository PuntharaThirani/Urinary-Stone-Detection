const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv'); // පරිසර විචල්‍යයන් (ENV)
const connectDB = require('./config/database'); // ඩේටාබේස් සම්බන්ධතාවය

// Routes
const predictionRoutes = require('./routes/predictionRoutes');
const authRoutes = require('./routes/authRoutes'); 
const reportRoutes = require('./routes/reportRoutes'); 
const userRoutes = require('./routes/userRoutes');     
const uploadRoutes = require('./routes/uploadRoutes'); 

const errorHandler = require('./middleware/errorHandler');

// 1. Config ලෝඩ් කිරීම (මුලින්ම කරන්න ඕන)
dotenv.config();

// 2. Database එකට සම්බන්ධ වීම
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check Models (Model එක තියෙනවද බැලීම)
const modelPath = path.join(__dirname, 'AI_Models', 'best.pt');
if (!fs.existsSync(modelPath)) {
    console.error("❌ WARNING: best.pt missing in AI_Models folder!");
} else {
    console.log("✅ best.pt found!");
}

// Routes පාවිච්චි කිරීම
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

//error handler
app.use(errorHandler);

// Root Route
app.get('/', (req, res) => {
    res.send('✅ Kidney Stone API is Running (With DB & Auth)');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
}

module.exports = app;