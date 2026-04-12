const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    // User who performed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Action performed
    action: {
      type: String,
      required: true,
      uppercase: true,
      enum: [
        'USER_LOGIN',
        'USER_REGISTER',
        'UPLOAD_XRAY',
        'PREDICT_XRAY',
        'CREATE_REPORT',
        'CONFIRM_REPORT',
        'VIEW_REPORT',
        'DELETE_REPORT',
      ],
    },

    // Target resource
    resourceType: {
      type: String,
      enum: ['USER', 'XRAY', 'REPORT'],
      default: null,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Additional details
    details: {
      type: String,
      trim: true,
    },

    // Request metadata
    method: {
      type: String,
      default: '',
    },

    route: {
      type: String,
      default: '',
    },

    ipAddress: {
      type: String,
      default: '',
    },

    // Success / failure
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
  },
  { timestamps: true }
);

// 🔥 Indexes for performance
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);