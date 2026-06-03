"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const errors_1 = require("../../shared/errors");
const userModel_1 = require("../user/userModel");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new errors_1.AppError('You are not logged in. Please log in to gain access.', 401));
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        // Check if user still exists
        const currentUser = await userModel_1.User.findById(decoded.id);
        if (!currentUser) {
            return next(new errors_1.AppError('The user belonging to this token no longer exists.', 401));
        }
        // Grant access and set user
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new errors_1.AppError('Invalid token. Please log in again.', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new errors_1.AppError('Your token has expired. Please log in again.', 401));
        }
        next(error);
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication context is missing.', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
