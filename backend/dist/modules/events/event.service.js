"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = exports.EventService = void 0;
const event_model_1 = require("./event.model");
const albumModel_1 = require("../event/albumModel");
const mediaModel_1 = require("../media/mediaModel");
const errors_1 = require("../../shared/errors");
class EventService {
    /**
     * Create a new event
     */
    async createEvent(data, createdBy) {
        const event = await event_model_1.Event.create({
            ...data,
            createdBy,
        });
        return event;
    }
    /**
     * Update an existing event
     */
    async updateEvent(id, data) {
        const event = await event_model_1.Event.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            throw new errors_1.AppError('No event found with that ID.', 404);
        }
        return event;
    }
    /**
     * Delete an event and clean up all associated albums and media
     */
    async deleteEvent(id) {
        const event = await event_model_1.Event.findByIdAndDelete(id);
        if (!event) {
            throw new errors_1.AppError('No event found with that ID.', 404);
        }
        // Cascading deletion of related albums and media in the background
        await albumModel_1.Album.deleteMany({ eventId: event._id });
        await mediaModel_1.Media.deleteMany({ eventId: event._id });
        return event;
    }
    /**
     * Get a single event by ID with accessibility check based on role
     */
    async getEventById(id, currentUserRole) {
        const event = await event_model_1.Event.findById(id).populate('createdBy', 'name email');
        if (!event) {
            throw new errors_1.AppError('No event found with that ID.', 404);
        }
        // Role-based visibility check for private events
        if (event.visibility === 'private') {
            const isAuthorized = currentUserRole && ['Admin', 'Photographer', 'ClubMember'].includes(currentUserRole);
            if (!isAuthorized) {
                throw new errors_1.AppError('This is a private event. Registered club members only.', 403);
            }
        }
        // Dynamic addition of associated media count
        const mediaCount = await mediaModel_1.Media.countDocuments({ eventId: event._id });
        return {
            ...event.toObject(),
            mediaCount,
        };
    }
    /**
     * Query all events with paginated searching, filtering, and role-based visibility restrictions
     */
    async queryEvents(options, currentUserRole) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        // Define visibility filter based on user roles
        const allowedVisibility = currentUserRole && ['Admin', 'Photographer', 'ClubMember'].includes(currentUserRole)
            ? ['public', 'private']
            : ['public'];
        const filterQuery = {
            visibility: { $in: allowedVisibility },
        };
        if (options.category) {
            filterQuery.category = options.category;
        }
        if (options.search) {
            filterQuery.$or = [
                { title: { $regex: options.search, $options: 'i' } },
                { description: { $regex: options.search, $options: 'i' } },
                { location: { $regex: options.search, $options: 'i' } },
            ];
        }
        // Build sort queries matching model indexes
        let sortQuery = { date: -1 }; // default: latest
        if (options.sort === 'oldest') {
            sortQuery = { date: 1 };
        }
        else if (options.sort === 'name') {
            sortQuery = { title: 1 };
        }
        const events = await event_model_1.Event.find(filterQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email');
        const total = await event_model_1.Event.countDocuments(filterQuery);
        // Compute media counts for each event
        const eventsWithMediaCount = await Promise.all(events.map(async (event) => {
            const mediaCount = await mediaModel_1.Media.countDocuments({ eventId: event._id });
            return {
                ...event.toObject(),
                mediaCount,
            };
        }));
        return {
            events: eventsWithMediaCount,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
}
exports.EventService = EventService;
exports.eventService = new EventService();
