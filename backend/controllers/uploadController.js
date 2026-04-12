const path = require('path');
const XrayImage = require('../models/XrayImage');

exports.uploadXray = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    // Normalize slashes for frontend compatibility
    const normalizedPath = req.file.path.replace(/\\/g, '/');

    // Optional DB save
    const savedImage = await XrayImage.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: normalizedPath,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user ? req.user.id : null,
    });

    return res.status(200).json({
      success: true,
      message: 'X-ray image uploaded successfully.',
      image: {
        id: savedImage._id,
        originalName: savedImage.originalName,
        fileName: savedImage.fileName,
        filePath: savedImage.filePath,
        mimeType: savedImage.mimeType,
        size: savedImage.size,
      },
    });
  } catch (error) {
    console.error('Upload X-ray Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload X-ray image.',
      error: error.message,
    });
  }
};