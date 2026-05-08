const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const adminController = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(auth);
router.use(allowRoles('admin'));

// System statistics
router.get('/stats',           adminController.getSystemStats);

// User management
router.get('/users',           adminController.getAllUsers);
router.get('/users/:id',       adminController.getUserById);
router.put('/users/:id/role',  adminController.updateUserRole);
router.delete('/users/:id',    adminController.deleteUser);

// Audit logs
router.get('/audit-logs',      adminController.getAuditLogs);
router.get('/recent-activity', adminController.getRecentActivity);

module.exports = router;