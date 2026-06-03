"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mediaController_1 = require("./mediaController");
const mediaSchema_1 = require("./mediaSchema");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const roleMiddleware_1 = require("../../middleware/roleMiddleware");
const accessControlMiddleware_1 = require("../../middleware/accessControlMiddleware");
const uploadMiddleware_1 = require("../../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
// Retrieve media in event (supports cursor pagination)
router.get('/event/:eventId', accessControlMiddleware_1.checkEventAccess, mediaController_1.getMedia);
// Upload endpoint (photographers and admins, allows bulk array uploads)
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.restrictTo)('Admin', 'Photographer'), uploadMiddleware_1.upload.array('media', 10), // Limit to 10 files per bulk request
mediaController_1.uploadMedia);
// Media highlights route
router.get('/highlights', mediaController_1.getMediaHighlights);
// Media tag routes
router.get('/:mediaId/tags', authMiddleware_1.protect, mediaController_1.getMediaTags);
router.post('/:mediaId/tag', authMiddleware_1.protect, mediaController_1.addMediaTag);
router.delete('/:mediaId/tag/:userId', authMiddleware_1.protect, mediaController_1.removeMediaTag);
// Likes and comments routes
router.post('/:mediaId/like', authMiddleware_1.protect, mediaController_1.toggleLike);
router.get('/:mediaId/comment', mediaController_1.getComments);
router.post('/:mediaId/comment', authMiddleware_1.protect, (0, validationMiddleware_1.validateRequest)(mediaSchema_1.addCommentSchema), mediaController_1.addComment);
// Download dynamic watermarked resource
// Accessible to anyone who has access to the event
router.get('/:mediaId/download', mediaController_1.downloadMedia);
exports.default = router;
