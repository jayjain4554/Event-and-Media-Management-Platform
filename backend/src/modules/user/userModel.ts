import { Schema, model, Document } from 'mongoose';

export type UserRole = 'Admin' | 'Photographer' | 'ClubMember' | 'Viewer';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  referenceSelfieUrl?: string;
  faceEmbedding?: number[];
  rekognitionFaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['Admin', 'Photographer', 'ClubMember', 'Viewer'],
      default: 'Viewer',
      index: true,
    },
    referenceSelfieUrl: {
      type: String,
      default: '',
    },
    faceEmbedding: {
      type: [Number],
      default: undefined,
    },
    rekognitionFaceId: {
      type: String,
      default: '',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
