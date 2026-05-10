const mongoose = require('mongoose');

const xrayImageSchema = new mongoose.Schema(
  {
    // Original file name from upload
    originalName: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Saved file name on server
    fileName: {
      type:     String,
      required: true,
      trim:     true,
    },

    // File path on server
    filePath: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Processed/annotated image path 
    processedImagePath: {
      type:    String,
      default: null,
      trim:    true,
    },

    // MIME type
    mimeType: {
      type:    String,
      default: '',
      trim:    true,
    },

    // File size in bytes
    size: {
      type:    Number,
      default: 0,
    },

    // Who uploaded this image
    uploadedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },

    // Whether AI has processed this image
    aiProcessed: {
      type:    Boolean,
      default: false,
    },

    // Image quality check status 
    qualityStatus: {
      type:    String,
      enum:    ['valid', 'invalid', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Indexes for performance
xrayImageSchema.index({ uploadedBy:    1 });
xrayImageSchema.index({ aiProcessed:   1 });
xrayImageSchema.index({ qualityStatus: 1 });
xrayImageSchema.index({ createdAt:    -1 });

module.exports = mongoose.model('XrayImage', xrayImageSchema);