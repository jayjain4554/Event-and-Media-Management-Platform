import { Schema, model, models } from 'mongoose';
import { IEvent } from './event.types';

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      trim: true,
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Event cover image is required'],
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compounded indexes for fast search, filter, and date-based sorting queries
eventSchema.index({ date: -1, title: 'text', category: 1 });
eventSchema.index({ createdAt: -1 });

export const Event = models.Event || model<IEvent>('Event', eventSchema);
