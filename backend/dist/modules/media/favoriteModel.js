"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorite = void 0;
const mongoose_1 = require("mongoose");
const favoriteSchema = new mongoose_1.Schema({
    mediaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Media',
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});
// Ensure a user can only favorite a media item once
favoriteSchema.index({ mediaId: 1, userId: 1 }, { unique: true });
exports.Favorite = (0, mongoose_1.model)('Favorite', favoriteSchema);
