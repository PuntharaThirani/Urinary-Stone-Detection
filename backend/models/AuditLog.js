const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    // ක්‍රියාව කළ කෙනා
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    
    // කළ දේ (Action)
    action: { 
        type: String, 
        required: true,
        uppercase: true 
        // Example: 'USER_LOGIN', 'UPLOAD_XRAY', 'GENERATE_REPORT'
    },
    
    // වැඩිදුර විස්තර
    details: { type: String },
    
    // IP Address එක (අවශ්‍ය නම්)
    ipAddress: { type: String },

    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);