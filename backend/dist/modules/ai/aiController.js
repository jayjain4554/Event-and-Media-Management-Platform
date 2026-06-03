"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySpottedMedia = void 0;
const mediaModel_1 = require("../media/mediaModel");
const errors_1 = require("../../shared/errors");
const getMySpottedMedia = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        // Fast query exploiting the indexing on detectedFaces.matchedUserId
        const spottedMedia = await mediaModel_1.Media.find({
            'detectedFaces.matchedUserId': req.user._id,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('eventId', 'title date coverImage visibility location category');
        const total = await mediaModel_1.Media.countDocuments({
            'detectedFaces.matchedUserId': req.user._id,
        });
        res.status(200).json({
            status: 'success',
            results: spottedMedia.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: { media: spottedMedia },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMySpottedMedia = getMySpottedMedia;
