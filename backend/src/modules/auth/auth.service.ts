import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../user/userModel';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors';
import { UserResponse } from './auth.types';

// ==========================================
// Refresh Token Schema & Model
// ==========================================

export interface IRefreshToken extends Document {
  token: string;
  userId: string;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enable Mongoose auto-expiry index on expiresAt
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<IRefreshToken>('RefreshToken', refreshTokenSchema);

// ==========================================
// Auth Service Implementation
// ==========================================

export class AuthService {
  /**
   * Helper to format User model to UserResponse
   */
  private formatUser(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      referenceSelfieUrl: user.referenceSelfieUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Helper to generate both Access and Refresh Tokens
   */
  private async generateTokenPair(userId: string, role: UserRole): Promise<{ accessToken: string; refreshToken: string }> {
    // 15-minute expiration for access tokens
    const accessToken = jwt.sign(
      { id: userId, role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // 7-day expiration for refresh tokens
    const refreshToken = jwt.sign(
      { id: userId },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshTokenModel.create({
      token: refreshToken,
      userId,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user
   */
  public async register(name: string, email: string, password: string, role: UserRole = 'Viewer') {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('A user with this email already exists.', 400);
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    const tokens = await this.generateTokenPair(newUser._id.toString(), newUser.role);

    return {
      user: this.formatUser(newUser),
      ...tokens,
    };
  }

  /**
   * Login user
   */
  public async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Incorrect email or password.', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new AppError('Incorrect email or password.', 401);
    }

    const tokens = await this.generateTokenPair(user._id.toString(), user.role);

    return {
      user: this.formatUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh the access and refresh token pair (implements refresh token rotation)
   */
  public async refresh(refreshTokenString: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(refreshTokenString, env.JWT_SECRET);
    } catch (err) {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    // Look up token in database to prevent reuse of revoked/logged out sessions
    const dbToken = await RefreshTokenModel.findOne({ token: refreshTokenString });
    if (!dbToken || dbToken.expiresAt < new Date()) {
      // If refresh token exists but is invalid, we should revoke all user tokens for safety (mitigate token hijacking)
      if (dbToken) {
        await RefreshTokenModel.deleteMany({ userId: dbToken.userId });
      }
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    // Revoke old refresh token (Token Rotation Strategy)
    await RefreshTokenModel.deleteOne({ _id: dbToken._id });

    // Generate new token pair
    const tokens = await this.generateTokenPair(user._id.toString(), user.role);

    return {
      user: this.formatUser(user),
      ...tokens,
    };
  }

  /**
   * Log out and revoke session refresh token
   */
  public async logout(refreshTokenString: string) {
    await RefreshTokenModel.deleteOne({ token: refreshTokenString });
  }
}

export const authService = new AuthService();
