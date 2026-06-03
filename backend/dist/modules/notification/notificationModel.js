"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'tag', 'event'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    mediaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Media',
    },
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Event',
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});
notificationSchema.index({ recipientId: 1, createdAt: -1 });
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
