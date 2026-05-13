const AuditLog = require('../models/AuditLog');

const createAuditLog = async ({
  userId = null,
  action,
  resourceType = null,
  resourceId = null,
  details = '',
  req = null,
  status = 'SUCCESS',
}) => {
  try {
    await AuditLog.create({
      user_id: userId,
      action,
      resourceType,
      resourceId,
      details,
      method: req?.method || '',
      route: req?.originalUrl || '',
      ipAddress: req?.ip || '',
      status,
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};

module.exports = createAuditLog;
