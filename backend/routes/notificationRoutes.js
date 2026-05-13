const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

router.get('/', auth, getMyNotifications);

router.put('/read-all', auth, markAllNotificationsAsRead);

router.put('/:id/read', auth, markNotificationAsRead);

router.delete('/:id', auth, deleteNotification);

module.exports = router;
