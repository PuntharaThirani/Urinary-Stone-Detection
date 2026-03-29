const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['doctor', 'patient', 'staff', 'admin'], 
        default: 'patient' 
    },
    phoneNumber: { type: String }, // අමතර විස්තර
    specialization: { type: String }, // දොස්තර කෙනෙක් නම් (Urologist etc.)
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);