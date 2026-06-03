"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSelfie = exports.searchUsers = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("./userModel");
const errors_1 = require("../../shared/errors");
const env_1 = require("../../config/env");
const s3Service_1 = require("../../services/s3Service");
const rekognitionService_1 = require("../../services/rekognitionService");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    });
};
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await userModel_1.User.findOne({ email });
        if (existingUser) {
            return next(new errors_1.AppError('A user with this email already exists.', 400));
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = await userModel_1.User.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.User.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            return next(new errors_1.AppError('Incorrect email or password.', 401));
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('No authenticated user context found.', 401));
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const searchUsers = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const query = (req.query.q || '').trim();
        if (!query) {
            return res.status(200).json({
                status: 'success',
                results: 0,
                data: { users: [] },
            });
        }
        const users = await userModel_1.User.find({
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
    }
    catch (error) {
        next(error);
    }
};
exports.searchUsers = searchUsers;
const uploadSelfie = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        if (!req.file) {
            return next(new errors_1.AppError('Please provide a face selfie image file.', 400));
        }
        // Upload to media repository (S3 or local fallback)
        const { url, key } = await (0, s3Service_1.uploadFile)(req.file.buffer, req.file.originalname, req.file.mimetype);
        // Remove any stale indexed Rekognition face for this user before adding the new selfie.
        if (req.user.rekognitionFaceId) {
            await (0, rekognitionService_1.deleteFaceFromCollection)(req.user.rekognitionFaceId);
        }
        // Index selfie face in AWS Rekognition collection
        const faceId = await (0, rekognitionService_1.indexSelfieFace)(req.file.buffer, req.user._id.toString());
        // Extract facial embeddings (for backward compatibility)
        const embeddings = (0, rekognitionService_1.generateMockEmbedding)();
        // Update user profile
        const updatedUser = await userModel_1.User.findByIdAndUpdate(req.user._id, {
            referenceSelfieUrl: url,
            faceEmbedding: embeddings,
            rekognitionFaceId: faceId || undefined,
        }, { new: true });
        res.status(200).json({
            status: 'success',
            message: 'Selfie registered successfully. Personalized facial discovery is now active!',
            data: {
                referenceSelfieUrl: url,
                faceEmbeddingLength: embeddings.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadSelfie = uploadSelfie;
