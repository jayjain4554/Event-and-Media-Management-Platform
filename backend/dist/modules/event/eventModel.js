"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        index: true,
    },
    description: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        index: true,
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
    },
    category: {
        type: String,
        required: [true, 'Event category is required'],
        trim: true,
        index: true,
    },
    coverImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public',
        index: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
// Compounded indexes for fast search/filtering queries
eventSchema.index({ date: -1, title: 'text', category: 1 });
eventSchema.index({ createdAt: -1 });
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
