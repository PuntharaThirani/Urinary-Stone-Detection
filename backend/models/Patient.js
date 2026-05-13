const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },

    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 0,
      max: 150,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    bloodGroup: {
      type: String,
      default: '',
      trim: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: '',
      trim: true,
    },

    emergencyContact: {
      type: String,
      default: '',
      trim: true,
    },

    medicalNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

patientSchema.index({ fullName: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ patientId: 1, email: 1 });

module.exports = mongoose.model('Patient', patientSchema);
