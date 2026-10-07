import { Notification } from '../models/Notification.js';

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public / Auth
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, notifications });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Public / Auth
export const markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
