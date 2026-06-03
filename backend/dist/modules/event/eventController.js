"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlbums = exports.createAlbum = exports.deleteEvent = exports.updateEvent = exports.getEvent = exports.getEvents = exports.createEvent = void 0;
const eventModel_1 = require("./eventModel");
const albumModel_1 = require("./albumModel");
const errors_1 = require("../../shared/errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const userModel_1 = require("../user/userModel");
const mediaModel_1 = require("../media/mediaModel");
const createEvent = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        const eventData = {
            ...req.body,
            createdBy: req.user._id,
        };
        const newEvent = await eventModel_1.Event.create(eventData);
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
const getEvents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { category, search, sort } = req.query;
        // Access control filtering
        let allowedVisibility = ['public'];
        // Check if user has an auth token sent in headers
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
                const user = await userModel_1.User.findById(decoded.id);
                if (user && ['Admin', 'Photographer', 'ClubMember'].includes(user.role)) {
                    allowedVisibility = ['public', 'private'];
                }
            }
            catch (err) {
                // Token invalid, treat as guest (only public events)
            }
        }
        const filterQuery = {
            visibility: { $in: allowedVisibility },
        };
        if (category) {
            filterQuery.category = category;
        }
        if (search) {
            filterQuery.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }
        // Build sort
        let sortQuery = { date: -1 }; // default: latest events first
        if (sort === 'oldest') {
            sortQuery = { date: 1 };
        }
        else if (sort === 'name') {
            sortQuery = { title: 1 };
        }
        const events = await eventModel_1.Event.find(filterQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email');
        const total = await eventModel_1.Event.countDocuments(filterQuery);
        // Dynamic addition of media count per event
        const eventsWithMediaCount = await Promise.all(events.map(async (event) => {
            const mediaCount = await mediaModel_1.Media.countDocuments({ eventId: event._id });
            return {
                ...event.toObject(),
                mediaCount,
            };
        }));
        res.status(200).json({
            status: 'success',
            results: events.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: { events: eventsWithMediaCount },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvents = getEvents;
const getEvent = async (req, res, next) => {
    try {
        const event = await eventModel_1.Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) {
            return next(new errors_1.AppError('No event found with that ID.', 404));
        }
        // Access control for private events
        if (event.visibility === 'private') {
            let authorized = false;
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }
            if (token) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
                    const user = await userModel_1.User.findById(decoded.id);
                    if (user && ['Admin', 'Photographer', 'ClubMember'].includes(user.role)) {
                        authorized = true;
                    }
                }
                catch (err) {
                    // Token invalid
                }
            }
            if (!authorized) {
                return next(new errors_1.AppError('This is a private event. Registered club members only.', 403));
            }
        }
        const mediaCount = await mediaModel_1.Media.countDocuments({ eventId: event._id });
        res.status(200).json({
            status: 'success',
            data: {
                event: {
                    ...event.toObject(),
                    mediaCount,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEvent = getEvent;
const updateEvent = async (req, res, next) => {
    try {
        const event = await eventModel_1.Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            return next(new errors_1.AppError('No event found with that ID.', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { event },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res, next) => {
    try {
        const event = await eventModel_1.Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return next(new errors_1.AppError('No event found with that ID.', 404));
        }
        // Clean up related media and albums in background
        await albumModel_1.Album.deleteMany({ eventId: event._id });
        await mediaModel_1.Media.deleteMany({ eventId: event._id });
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
// Album controllers
const createAlbum = async (req, res, next) => {
    try {
        const eventId = req.params?.eventId || req.body?.eventId;
        if (!eventId) {
            return next(new errors_1.AppError('Event ID is required to create an album.', 400));
        }
        const albumData = {
            ...req.body,
            eventId,
        };
        const newAlbum = await albumModel_1.Album.create(albumData);
        res.status(201).json({
            status: 'success',
            data: { album: newAlbum },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAlbum = createAlbum;
const getAlbums = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const albums = await albumModel_1.Album.find({ eventId }).sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: albums.length,
            data: { albums },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAlbums = getAlbums;
