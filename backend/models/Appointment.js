const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Patient reference
    patientId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Patient',
      required: true,
    },

    // Doctor reference
    doctorId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // Appointment date and time
    appointmentDate: {
      type:     Date,
      required: true,
    },

    timeSlot: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Reason for appointment
    reason: {
      type:    String,
      default: '',
      trim:    true,
    },

    // Appointment status — lowercase to match controller
    status: {
      type:    String,
      enum:    ['scheduled', 'completed', 'cancelled', 'pending'],
      default: 'scheduled', //  Fixed — lowercase
    },

    // Additional notes
    notes: {
      type:    String,
      default: '',
      trim:    true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId:  1 });
appointmentSchema.index({ appointmentDate: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);