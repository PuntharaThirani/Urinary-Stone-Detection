const Notification = require('../models/Notification');

const createNotification = async ({
  userId,
  title,
  message,
  type = 'info',
  link = '',
}) => {
  try {
    if (!userId || !title || !message) return;

    await Notification.create({
      userId,
      title,
      message,
      type,
      link,
      isRead: false,
    });
  } catch (error) {
    console.error('Notification create failed:', error.message);
  }
};

module.exports = createNotification;
