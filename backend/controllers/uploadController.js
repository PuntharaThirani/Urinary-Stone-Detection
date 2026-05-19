const path     = require('path');
const XrayImage = require('../models/XrayImage');

// UPLOAD X-RAY IMAGE

exports.uploadXray = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only JPEG and PNG images are allowed',
      });
    }

    // Normalize path for cross-platform compatibility
    const normalizedPath = req.file.path.replace(/\\/g, '/');

    // Save to database
    const savedImage = await XrayImage.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: normalizedPath,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user ? req.user.id : null,
      qualityStatus: 'valid',
    });

    return res.status(200).json({
      success: true,
      message: 'X-ray image uploaded successfully',
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
      message: 'Failed to upload X-ray image',
      error: error.message,
    });
  }
};