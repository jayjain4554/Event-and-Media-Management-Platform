"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const event_validation_1 = require("./event.validation");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', (0, validationMiddleware_1.validateRequest)(event_validation_1.queryEventSchema), event_controller_1.getEvents);
router.get('/:id', event_controller_1.getEvent);
// Protected actions for creating, updating, and deleting events
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('Admin', 'Photographer'), (0, validationMiddleware_1.validateRequest)(event_validation_1.createEventSchema), event_controller_1.createEvent);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('Admin', 'Photographer'), (0, validationMiddleware_1.validateRequest)(event_validation_1.updateEventSchema), event_controller_1.updateEvent);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.restrictTo)('Admin'), event_controller_1.deleteEvent);
exports.default = router;
