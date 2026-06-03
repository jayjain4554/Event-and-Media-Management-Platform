"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = exports.getEvent = exports.deleteEvent = exports.updateEvent = exports.createEvent = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const event_service_1 = require("./event.service");
const errors_1 = require("../../shared/errors");
const env_1 = require("../../config/env");
const userModel_1 = require("../user/userModel");
/**
 * Helper to identify user role when reading public/unprotected endpoints
 */
const getUserRoleFromRequest = async (req) => {
    if (req.user) {
        return req.user.role;
    }
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            const user = await userModel_1.User.findById(decoded.id);
            if (user) {
                return user.role;
            }
        }
        catch (err) {
            // Token is invalid/expired; handle request as a guest reader
        }
    }
    return undefined;
};
const createEvent = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        const newEvent = await event_service_1.eventService.createEvent(req.body, req.user._id.toString());
        res.status(201).json({
            status: 'success',
            data: { event: newEvent },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await event_service_1.eventService.updateEvent(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: { event: updatedEvent },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res, next) => {
    try {
        await event_service_1.eventService.deleteEvent(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEvent = deleteEvent;
const getEvent = async (req, res, next) => {
    try {
        const role = await getUserRoleFromRequest(req);
        const event = await event_service_1.eventService.getEventById(req.params.id, role);
        res.status(200).json({
            status: 'success',
            data: { event },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvent = getEvent;
const getEvents = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { category, search, sort } = req.query;
        const role = await getUserRoleFromRequest(req);
        const result = await event_service_1.eventService.queryEvents({
            category,
            search,
            sort: sort,
            page,
            limit,
        }, role);
        res.status(200).json({
            status: 'success',
            results: result.events.length,
            total: result.total,
            page: result.page,
            pages: result.pages,
            data: { events: result.events },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvents = getEvents;
