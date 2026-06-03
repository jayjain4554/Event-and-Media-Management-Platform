"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("./eventController");
const eventSchema_1 = require("./eventSchema");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const roleMiddleware_1 = require("../../middleware/roleMiddleware");
const accessControlMiddleware_1 = require("../../middleware/accessControlMiddleware");
const router = (0, express_1.Router)();
// Publicly accessible with dynamic privacy parsing inside the controllers
router.get('/', eventController_1.getEvents);
router.get('/:id', eventController_1.getEvent);
// Protected: Admin and Photographer operations
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)('Admin', 'Photographer'), (0, validationMiddleware_1.validateRequest)(eventSchema_1.createEventSchema), eventController_1.createEvent);
router.patch('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)('Admin', 'Photographer'), (0, validationMiddleware_1.validateRequest)(eventSchema_1.updateEventSchema), eventController_1.updateEvent);
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)('Admin', 'Photographer'), eventController_1.deleteEvent);
// Album CRUD sub-routes
router.get('/:eventId/albums', accessControlMiddleware_1.checkEventAccess, eventController_1.getAlbums);
router.post('/:eventId/albums', authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)('Admin', 'Photographer'), accessControlMiddleware_1.checkEventAccess, (0, validationMiddleware_1.validateRequest)(eventSchema_1.createAlbumSchema), eventController_1.createAlbum);
exports.default = router;
