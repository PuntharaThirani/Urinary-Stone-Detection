const User = require('../models/User');

// 1. තමන්ගේ Profile එක බැලීම (Login වුනාට පස්සේ)
exports.getMe = async (req, res) => {
    try {
        // Password එක අතහැරලා අනිත් විස්තර එවනවා
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. සියලුම Users ලා බැලීම (Admin/Staff සඳහා)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};