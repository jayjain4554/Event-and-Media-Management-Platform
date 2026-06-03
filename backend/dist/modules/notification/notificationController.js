"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.getNotifications = void 0;
const notificationModel_1 = require("./notificationModel");
const errors_1 = require("../../shared/errors");
const getNotifications = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const notifications = await notificationModel_1.Notification.find({ recipientId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('senderId', 'name email role')
            .populate('mediaId', 'fileUrl fileType')
            .populate('eventId', 'title coverImage');
        const total = await notificationModel_1.Notification.countDocuments({ recipientId: req.user._id });
        const unreadCount = await notificationModel_1.Notification.countDocuments({ recipientId: req.user._id, isRead: false });
        res.status(200).json({
            status: 'success',
            results: notifications.length,
            total,
            unreadCount,
            page,
            pages: Math.ceil(total / limit),
            data: { notifications },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
const markRead = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const { notificationIds } = req.body;
        if (notificationIds && Array.isArray(notificationIds)) {
            // Mark specific notifications as read
            await notificationModel_1.Notification.updateMany({ _id: { $in: notificationIds }, recipientId: req.user._id }, { isRead: true });
        }
        else {
            // Mark all notifications as read
            await notificationModel_1.Notification.updateMany({ recipientId: req.user._id }, { isRead: true });
        }
        res.status(200).json({
            status: 'success',
            message: 'Notifications marked as read.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markRead = markRead;
