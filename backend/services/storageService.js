const fs = require('fs');
const path = require('path');

// Upload directories
const UPLOAD_DIR    = path.join(__dirname, '..', 'uploads', 'xrays');
const PROCESSED_DIR = path.join(__dirname, '..', 'uploads', 'processed');


// Delete File from Server

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Delete Error: ${error.message}`);
    return false;
  }
};


// Move Processed Image to Processed Folder

const moveToProcessed = (sourcePath, fileName) => {
  try {
    // Create processed folder if not exists
    if (!fs.existsSync(PROCESSED_DIR)) {
      fs.mkdirSync(PROCESSED_DIR, { recursive: true });
    }

    const destPath = path.join(PROCESSED_DIR, fileName);

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Moved to processed: ${destPath}`);

    // Normalize for frontend
    return destPath.replace(/\\/g, '/');
  } catch (error) {
    console.error(`❌ Move Error: ${error.message}`);
    return null;
  }
};


// Get File Size in MB

const getFileSizeMB = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / (1024 * 1024)).toFixed(2);
  } catch {
    return 0;
  }
};


// Cloud Upload — Future Implementation
// Currently saves locally

const uploadToCloud = async (filePath) => {
  // TODO: Replace with Cloudinary / AWS S3
  console.log('ℹ️ Cloud upload not configured — using local storage');
  return null;
};

module.exports = {
  deleteFile,
  moveToProcessed,
  getFileSizeMB,
  uploadToCloud,
};