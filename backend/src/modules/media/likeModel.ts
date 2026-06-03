import { Schema, model, Document, Types } from 'mongoose';

export interface ILike extends Document {
  mediaId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
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

// Ensure a user can only like a media item once
likeSchema.index({ mediaId: 1, userId: 1 }, { unique: true });

export const Like = model<ILike>('Like', likeSchema);
