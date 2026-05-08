const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ===============================
// CREATE UPLOAD FOLDERS
// ===============================
const uploadDirs = ['uploads/xrays', 'uploads/processed'];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ===============================
// STORAGE CONFIGURATION
// ===============================
const storage = multer.diskStorage({
  // Save to uploads/xrays folder
  destination: (req, file, cb) => {
    cb(null, 'uploads/xrays');
  },

  // Generate safe unique filename
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Remove extension from original name first
    const nameWithoutExt = path.basename(
      file.originalname, 
      ext
    );

    // Create safe filename — remove special characters
    const safeName = nameWithoutExt
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    // Final: timestamp-safename.ext ✅
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

// ===============================
// FILE TYPE FILTER
// ===============================
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/jpg',
  ];
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) && 
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Only JPG, JPEG, PNG images are allowed'), 
      false
    );
  }
};

// ===============================
// MULTER INSTANCE
// ===============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files:    1,                // Only 1 file at a time
  },
});

module.exports = upload;