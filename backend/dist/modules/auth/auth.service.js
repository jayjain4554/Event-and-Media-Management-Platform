"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = exports.RefreshTokenModel = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../user/userModel");
const env_1 = require("../../config/env");
const errors_1 = require("../../shared/errors");
const refreshTokenSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Enable Mongoose auto-expiry index on expiresAt
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.RefreshTokenModel = (0, mongoose_1.model)('RefreshToken', refreshTokenSchema);
// ==========================================
// Auth Service Implementation
// ==========================================
class AuthService {
    /**
     * Helper to format User model to UserResponse
     */
    formatUser(user) {
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
    async generateTokenPair(userId, role) {
        // 15-minute expiration for access tokens
        const accessToken = jsonwebtoken_1.default.sign({ id: userId, role }, env_1.env.JWT_SECRET, { expiresIn: '15m' });
        // 7-day expiration for refresh tokens
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
        // Save refresh token to database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await exports.RefreshTokenModel.create({
            token: refreshToken,
            userId,
            expiresAt,
        });
        return { accessToken, refreshToken };
    }
    /**
     * Register a new user
     */
    async register(name, email, password, role = 'Viewer') {
        const existingUser = await userModel_1.User.findOne({ email });
        if (existingUser) {
            throw new errors_1.AppError('A user with this email already exists.', 400);
        }
        // Hash password with bcrypt
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = await userModel_1.User.create({
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
    async login(email, password) {
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            throw new errors_1.AppError('Incorrect email or password.', 401);
        }
        const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new errors_1.AppError('Incorrect email or password.', 401);
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
    async refresh(refreshTokenString) {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshTokenString, env_1.env.JWT_SECRET);
        }
        catch (err) {
            throw new errors_1.AppError('Invalid or expired refresh token.', 401);
        }
        // Look up token in database to prevent reuse of revoked/logged out sessions
        const dbToken = await exports.RefreshTokenModel.findOne({ token: refreshTokenString });
        if (!dbToken || dbToken.expiresAt < new Date()) {
            // If refresh token exists but is invalid, we should revoke all user tokens for safety (mitigate token hijacking)
            if (dbToken) {
                await exports.RefreshTokenModel.deleteMany({ userId: dbToken.userId });
            }
            throw new errors_1.AppError('Invalid or expired refresh token.', 401);
        }
        const user = await userModel_1.User.findById(decoded.id);
        if (!user) {
            throw new errors_1.AppError('The user belonging to this token no longer exists.', 401);
        }
        // Revoke old refresh token (Token Rotation Strategy)
        await exports.RefreshTokenModel.deleteOne({ _id: dbToken._id });
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
    async logout(refreshTokenString) {
        await exports.RefreshTokenModel.deleteOne({ token: refreshTokenString });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
