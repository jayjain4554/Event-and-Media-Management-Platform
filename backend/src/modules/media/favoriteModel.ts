import { Schema, model, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  mediaId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: true,
      index: true,
    },
    userId: {
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

// Ensure a user can only favorite a media item once
favoriteSchema.index({ mediaId: 1, userId: 1 }, { unique: true });

export const Favorite = model<IFavorite>('Favorite', favoriteSchema);
