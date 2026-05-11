const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    // Linked user account
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: false,
      default: null
    },

    // Hospital patient ID
    patientId: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      uppercase: true,
    },

    email: {
     type: String,
     trim: true,
     lowercase: true
    },

    // Full name
    fullName: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Age
    age: {
      type: Number,
      min:  0,
      max:  150,
    },

    // Gender — lowercase to match validation
    gender: {
      type: String,
      enum: ['male', 'female', 'other'], // ✅ Fixed lowercase
    },

    // Blood group
    bloodGroup: {
      type:    String,
      default: '',
      trim:    true,
      enum:    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
    },

    // Contact number
    contactNumber: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Address
    address: {
      type:    String,
      default: '',
      trim:    true,
    },

    // Emergency contact
    emergencyContact: {
      type:    String,
      default: '',
      trim:    true,
    },

    // Medical notes
    medicalNotes: {
      type:    String,
      default: '',
      trim:    true,
    },
  },
  { timestamps: true }
);

// Indexes

patientSchema.index({ fullName:  1 });

module.exports = mongoose.model('Patient', patientSchema);