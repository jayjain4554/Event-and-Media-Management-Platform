"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEventAccess = void 0;
const errors_1 = require("../shared/errors");
const eventModel_1 = require("../modules/event/eventModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const userModel_1 = require("../modules/user/userModel");
const checkEventAccess = async (req, res, next) => {
    try {
        const eventId = req.params.eventId || req.body.eventId;
        if (!eventId) {
            return next(new errors_1.AppError('Event ID is required for access control verification.', 400));
        }
        const event = await eventModel_1.Event.findById(eventId);
        if (!event) {
            return next(new errors_1.AppError('No event found with that ID.', 404));
        }
        // Public event: accessible to everyone
        if (event.visibility === 'public') {
            return next();
        }
        // Private event: requires authenticated Admin, Photographer, or ClubMember
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new errors_1.AppError('This event is private. Please log in to view.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const user = await userModel_1.User.findById(decoded.id);
        if (!user) {
            return next(new errors_1.AppError('Authentication user no longer exists.', 401));
        }
        // Allowed roles for private albums: Admin, Photographer, ClubMember
        if (['Admin', 'Photographer', 'ClubMember'].includes(user.role)) {
            req.user = user; // Attach authenticated context
            return next();
        }
        return next(new errors_1.AppError('Access denied. Private events are restricted to registered members.', 403));
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return next(new errors_1.AppError('Private resource. Authentication failed.', 401));
        }
        next(error);
    }
};
exports.checkEventAccess = checkEventAccess;
