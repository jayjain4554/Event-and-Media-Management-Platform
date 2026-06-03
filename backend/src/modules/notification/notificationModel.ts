import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'like' | 'comment' | 'tag' | 'event';

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  senderId?: Types.ObjectId;
  type: NotificationType;
  message: string;
  mediaId?: Types.ObjectId;
  eventId?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
