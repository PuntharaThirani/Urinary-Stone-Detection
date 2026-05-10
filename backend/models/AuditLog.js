const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    // User who performed the action
    user_id: {                              
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },

    // Action performed
    action: {
      type:      String,
      required:  true,
      uppercase: true,
      enum: [
        'USER_LOGIN',
        'USER_REGISTER',
        'USER_LOGOUT',
        'UPLOAD_XRAY',
        'PREDICT_XRAY',
        'CREATE_REPORT',
        'CONFIRM_REPORT',
        'REJECT_REPORT',        
        'EDIT_REPORT',          
        'VIEW_REPORT',
        'DELETE_REPORT',
        'CREATE_PATIENT',       
        'UPDATE_PATIENT',       
        'DELETE_PATIENT',       
        'CREATE_APPOINTMENT',   
        'UPDATE_APPOINTMENT',   
        'DELETE_APPOINTMENT',   
        'ROLE_UPDATED',         
        'USER_DELETED',         
      ],
    },

    // Target resource type
    resourceType: {
      type:    String,
      enum:    ['USER', 'XRAY', 'REPORT', 'PATIENT', 'APPOINTMENT'],
      default: null,
    },

    // Target resource ID
    resourceId: {
      type:    mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Additional details
    details: {
      type: String,
      trim: true,
    },

    // HTTP method
    method: {
      type:    String,
      default: '',
    },

    // API route
    route: {
      type:    String,
      default: '',
    },

    // Client IP address
    ipAddress: {
      type:    String,
      default: '',
    },

    // Success or failure
    status: {
      type:    String,
      enum:    ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
    },
  },
  { timestamps: true }
);

// Indexes for query performance
auditLogSchema.index({ user_id:   1 });
auditLogSchema.index({ action:    1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);