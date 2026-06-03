import { Response, NextFunction } from 'express';
import { Notification } from './notificationModel';
import { AppError } from '../../shared/errors';
import { AuthenticatedRequest } from '../../shared/types';

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipientId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'name email role')
      .populate('mediaId', 'fileUrl fileType')
      .populate('eventId', 'title coverImage');

    const total = await Notification.countDocuments({ recipientId: req.user._id });
    const unreadCount = await Notification.countDocuments({ recipientId: req.user._id, isRead: false });

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit),
      data: { notifications },
    });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));

    const { notificationIds } = req.body;

    if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, recipientId: req.user._id },
        { isRead: true }
      );
    } else {
      // Mark all notifications as read
      await Notification.updateMany(
        { recipientId: req.user._id },
        { isRead: true }
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};
