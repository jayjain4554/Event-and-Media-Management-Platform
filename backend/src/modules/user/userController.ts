import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from './userModel';
import { AppError } from '../../shared/errors';
import { env } from '../../config/env';
import { AuthenticatedRequest } from '../../shared/types';
import { uploadFile } from '../../services/s3Service';
import { generateMockEmbedding, detectFaces, deleteFaceFromCollection, indexSelfieFace } from '../../services/rekognitionService';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('A user with this email already exists.', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    const token = generateToken(newUser._id.toString());

    // Return user without password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({
      status: 'success',
      token,
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return next(new AppError('Incorrect email or password.', 401));
    }

    const token = generateToken(user._id.toString());

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      referenceSelfieUrl: user.referenceSelfieUrl,
    };

    res.status(200).json({
      status: 'success',
      token,
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('No authenticated user context found.', 401));
    }

    const userResponse = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      referenceSelfieUrl: req.user.referenceSelfieUrl,
    };

    res.status(200).json({
      status: 'success',
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));

    const query = (req.query.q as string || '').trim();
    if (!query) {
      return res.status(200).json({
        status: 'success',
        results: 0,
        data: { users: [] },
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .limit(12)
      .select('name email role');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadSelfie = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!req.file) {
      return next(new AppError('Please provide a face selfie image file.', 400));
    }

    // Upload to media repository (S3 or local fallback)
    const { url, key } = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Remove any stale indexed Rekognition face for this user before adding the new selfie.
    if (req.user.rekognitionFaceId) {
      await deleteFaceFromCollection(req.user.rekognitionFaceId);
    }

    // Index selfie face in AWS Rekognition collection
    const faceId = await indexSelfieFace(req.file.buffer, req.user._id.toString());

    // Extract facial embeddings (for backward compatibility)
    const embeddings = generateMockEmbedding();

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        referenceSelfieUrl: url,
        faceEmbedding: embeddings,
        rekognitionFaceId: faceId || undefined,
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Selfie registered successfully. Personalized facial discovery is now active!',
      data: {
        referenceSelfieUrl: url,
        faceEmbeddingLength: embeddings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
