"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
const mongoose_1 = require("mongoose");
const albumSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Album title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
albumSchema.index({ eventId: 1, createdAt: -1 });
exports.Album = (0, mongoose_1.model)('Album', albumSchema);
