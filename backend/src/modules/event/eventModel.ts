import { Schema, model, Document, Types } from 'mongoose';

export type EventVisibility = 'public' | 'private';

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  location: string;
  category: string;
  coverImage?: string;
  visibility: EventVisibility;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
      default: '',
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
      default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
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

// Compounded indexes for fast search/filtering queries
eventSchema.index({ date: -1, title: 'text', category: 1 });
eventSchema.index({ createdAt: -1 });

export const Event = model<IEvent>('Event', eventSchema);
