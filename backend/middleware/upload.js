const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===============================
// CREATE FOLDERS
// ===============================
const uploadDirs = ['uploads/xrays', 'uploads/processed'];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ===============================
// STORAGE CONFIG
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/xrays'); // 🔥 correct folder
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // 🔥 safe filename
    const safeName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');

    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

// ===============================
// FILE FILTER (STRICT)
// ===============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExt = ['.jpg', '.jpeg', '.png'];

  if (allowedTypes.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG images are allowed'), false);
  }
};

// ===============================
// MULTER INSTANCE
// ===============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;