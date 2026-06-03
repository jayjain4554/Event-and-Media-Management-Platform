"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
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
// Ensure a user can only like a media item once
likeSchema.index({ mediaId: 1, userId: 1 }, { unique: true });
exports.Like = (0, mongoose_1.model)('Like', likeSchema);
