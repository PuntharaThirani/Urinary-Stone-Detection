const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    // Report එක හැදූ දොස්තර (Login වී සිටින විට)
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    
    // රෝගියාගේ විස්තර
    patientName: { type: String, required: true },
    patientAge: { type: Number },
    patientGender: { type: String, enum: ['Male', 'Female', 'Other'] },

    // X-ray පින්තූරය (XrayImage Model එකට සම්බන්ධයි)
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'XrayImage'
    },
    imagePath: { type: String, required: true }, // ලේසියට කෙලින්ම Path එකත් තියාගමු

    // AI Prediction ප්‍රතිඵල (YOLOv8 වලින් එන Bounding boxes)
    aiResult: { type: Object }, 
    hasStones: { type: Boolean, default: false },
    stoneCount: { type: Number, default: 0 },

    // 🚀 අලුතින් එකතු කරපු දේවල් (HITL Workflow එකට)
    aiDraft: { type: String }, // Gemini AI එකෙන් හදන මූලික වාර්තාව (Draft Report)
    doctorNotes: { type: String }, // දොස්තර අලුතින් එකතු කරන සටහන්

    // දොස්තරගේ නිගමනය සහ Report එකේ තත්ත්වය
    diagnosis: { type: String }, 
    status: { 
        type: String, 
        // pending = තාම දොස්තර බලලා නෑ, verified = දොස්තර Confirm කරලා තියෙන්නේ
        enum: ['pending', 'verified', 'rejected'], 
        default: 'pending' 
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);