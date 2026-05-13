import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NotificationBell = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      const res = await api.get('/notifications');

      setNotifications(res.data.data || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    fetchNotifications();
  };

  const handleNotificationClick = async (notification) => {
    try {
      await api.put(`/notifications/${notification._id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));

      setOpen(false);

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleReadAll = async () => {
    try {
      await api.put('/notifications/read-all');

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!token) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full p-2 text-white transition hover:bg-white/10"
        title="Notifications"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-black text-slate-900">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleReadAll}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    notification.isRead ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[11px] font-semibold text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
