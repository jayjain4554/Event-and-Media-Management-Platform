import { Schema, model, Document, Types } from 'mongoose';

export interface IMediaTag {
  label: string;
  confidence: number;
}

export interface IMediaTaggedUser {
  userId: Types.ObjectId;
  taggedBy: Types.ObjectId;
  taggedAt: Date;
}

export interface IMediaFace {
  boundingBox: {
    Width: number;
    Height: number;
    Left: number;
    Top: number;
  };
  faceEmbedding?: number[];
  matchedUserId?: Types.ObjectId;
  faceMatchScore?: number;
  matchedAt?: Date;
}

export type MediaVisibility = 'public' | 'private';

export interface IMedia extends Document {
  eventId: Types.ObjectId;
  albumId?: Types.ObjectId;
  uploaderId: Types.ObjectId;
  fileUrl: string;
  fileKey: string;
  publicId?: string;
  secureUrl?: string;
  thumbnailUrl?: string;
  fileType: 'image' | 'video';
  resourceType?: 'image' | 'video';
  visibility: MediaVisibility;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  tags: IMediaTag[];
  taggedUsers: IMediaTaggedUser[];
  detectedFaces: IMediaFace[];
  duplicateHash: string;
  likesCount: number;
  commentsCount: number;
  originalFilename: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    albumId: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      index: true,
    },
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    secureUrl: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    resourceType: {
      type: String,
      enum: ['image', 'video'],
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
      index: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    width: Number,
    height: Number,
    tags: [
      {
        label: { type: String, required: true },
        confidence: { type: Number, required: true },
      },
    ],
    taggedUsers: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        taggedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        taggedAt: { type: Date, required: true, default: Date.now },
      },
    ],
    detectedFaces: [
      {
        boundingBox: {
          Width: Number,
          Height: Number,
          Left: Number,
          Top: Number,
        },
        faceEmbedding: [Number],
        matchedUserId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        faceMatchScore: Number,
        matchedAt: Date,
      },
    ],
    duplicateHash: {
      type: String,
      required: true,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    originalFilename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for ultra-fast query performance
mediaSchema.index({ eventId: 1, createdAt: -1 });
mediaSchema.index({ albumId: 1, createdAt: -1 });
mediaSchema.index({ 'tags.label': 1 });
mediaSchema.index({ visibility: 1 });
mediaSchema.index({ 'taggedUsers.userId': 1 });
mediaSchema.index({ createdAt: -1 });

export const Media = model<IMedia>('Media', mediaSchema);
