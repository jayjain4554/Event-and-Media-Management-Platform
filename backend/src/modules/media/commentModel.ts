import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  mediaId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
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
    text: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ mediaId: 1, createdAt: -1 });

export const Comment = model<IComment>('Comment', commentSchema);
