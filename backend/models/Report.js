const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    // Linked doctor
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Linked patient (better than relying only on patientName)
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },

    // Snapshot patient details at report creation time
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientAge: {
      type: Number,
      min: 0,
    },
    patientGender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },

    // X-ray image reference
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'XrayImage',
      default: null,
    },
    imagePath: {
      type: String,
      required: true,
      trim: true,
    },

    // AI prediction output
    aiResult: {
      type: Object,
      default: {},
    },
    hasStones: {
      type: Boolean,
      default: false,
    },
    stoneCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // AI-generated draft
    aiDraft: {
      type: String,
      default: '',
      trim: true,
    },

    // Doctor review section
    doctorNotes: {
      type: String,
      default: '',
      trim: true,
    },
    doctorAdvice: {
      type: String,
      default: '',
      trim: true,
    },
    finalDiagnosis: {
      type: String,
      default: '',
      trim: true,
    },
    followUp: {
      type: String,
      default: '',
      trim: true,
    },

    // Confirmation flags
    doctorConfirmed: {
      type: Boolean,
      default: false,
    },

    // Report workflow status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);