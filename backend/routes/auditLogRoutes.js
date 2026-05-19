const express = require('express');

const router = express.Router();

const auth =
  require('../middleware/auth');

const allowRoles =
  require('../middleware/role');

const {
  getAuditLogs,
  deleteOldAuditLogs

} = require(
  '../controllers/auditLogController'
);


// =========================
// GET AUDIT LOGS
// ADMIN ONLY
// =========================

router.get(
  '/',

  auth,

  allowRoles('admin'),

  getAuditLogs
);


// =========================
// DELETE OLD LOGS
// ADMIN ONLY
// =========================

router.delete(
  '/cleanup',

  auth,

  allowRoles('admin'),

  deleteOldAuditLogs
);


module.exports = router;