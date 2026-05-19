const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  try {
    const { action, userId, status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (action)    filter.action    = action;
    if (userId)    filter.user_id   = userId;
    if (status)    filter.status    = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate)   filter.createdAt.$lte = new Date(endDate);
    }

    const skip  = (page - 1) * limit;
    const total = await AuditLog.countDocuments(filter);
    const logs  = await AuditLog.find(filter)
      .populate('user_id', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      data:  logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs', error: error.message });
  }
};

const deleteOldAuditLogs = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(days));

    const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoff } });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} logs older than ${days} days`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete audit logs', error: error.message });
  }
};

module.exports = { getAuditLogs, deleteOldAuditLogs };