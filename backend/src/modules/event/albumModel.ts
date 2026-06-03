import { Schema, model, Document, Types } from 'mongoose';

export interface IAlbum extends Document {
  eventId: Types.ObjectId;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Album title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

albumSchema.index({ eventId: 1, createdAt: -1 });

export const Album = model<IAlbum>('Album', albumSchema);
