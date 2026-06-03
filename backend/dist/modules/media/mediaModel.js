"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true,
    },
    albumId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Album',
        index: true,
    },
    uploaderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileKey: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
    },
    secureUrl: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
    },
    fileType: {
        type: String,
        enum: ['image', 'video'],
        required: true,
    },
    resourceType: {
        type: String,
        enum: ['image', 'video'],
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
        index: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    width: Number,
    height: Number,
    tags: [
        {
            label: { type: String, required: true },
            confidence: { type: Number, required: true },
        },
    ],
    taggedUsers: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
            taggedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            taggedAt: { type: Date, required: true, default: Date.now },
        },
    ],
    detectedFaces: [
        {
            boundingBox: {
                Width: Number,
                Height: Number,
                Left: Number,
                Top: Number,
            },
            faceEmbedding: [Number],
            matchedUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
            faceMatchScore: Number,
            matchedAt: Date,
        },
    ],
    duplicateHash: {
        type: String,
        required: true,
        index: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    originalFilename: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
// Indexes for ultra-fast query performance
mediaSchema.index({ eventId: 1, createdAt: -1 });
mediaSchema.index({ albumId: 1, createdAt: -1 });
mediaSchema.index({ 'tags.label': 1 });
mediaSchema.index({ visibility: 1 });
mediaSchema.index({ 'taggedUsers.userId': 1 });
mediaSchema.index({ createdAt: -1 });
exports.Media = (0, mongoose_1.model)('Media', mediaSchema);
