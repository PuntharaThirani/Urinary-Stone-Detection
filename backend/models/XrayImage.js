const mongoose = require('mongoose');

const xrayImageSchema = new mongoose.Schema({
    filename: { type: String, required: true }, // server එකේ save වුන නම
    originalName: { type: String }, // upload කරද්දි තිබුන නම
    path: { type: String, required: true },
    mimetype: { type: String }, // image/jpeg, image/png
    size: { type: Number }, // file size (bytes)
    
    // කවුද Upload කළේ?
    uploadedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('XrayImage', xrayImageSchema);