const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const XrayImage = require('../models/XrayImage');
const Report = require('../models/Report');


// GET ALL USERS

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// GET USER BY ID

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// UPDATE USER ROLE

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    const allowedRoles = ['doctor', 'patient', 'staff', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role provided' 
      });
    }

    // Prevent admin from changing own role
    if (req.params.id === req.user.id?.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Role updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// DELETE USER

exports.deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting own account
    if (req.params.id === req.user.id?.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// GET SYSTEM STATS

exports.getSystemStats = async (req, res) => {
  try {
    // User counts by role
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalStaff,
      totalAdmins,
      totalScans,
      totalReports,
      stonesDetected,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'staff' }),
      User.countDocuments({ role: 'admin' }),
      XrayImage.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ stoneCount: { $gt: 0 } }),
    ]);

    // Today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayScans = await XrayImage.countDocuments({ 
      createdAt: { $gte: today } 
    });

    // Last 7 days scans
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const weeklyScans = await XrayImage.countDocuments({ 
      createdAt: { $gte: last7Days } 
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          doctors: totalDoctors,
          patients:totalPatients,
          staff: totalStaff,
          admins: totalAdmins,
        },
        scans: {
          total: totalScans,
          today: todayScans,
          thisWeek: weeklyScans,
          stonesDetected,
        },
        reports: {
          total: totalReports,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// GET AUDIT LOGS

exports.getAuditLogs = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate('user_id', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// GET RECENT ACTIVITY

exports.getRecentActivity = async (req, res) => {
  try {
    const recentLogs = await AuditLog.find()
      .populate('user_id', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ 
      success: true, 
      data: recentLogs,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};