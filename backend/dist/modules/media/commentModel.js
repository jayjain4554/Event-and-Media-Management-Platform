"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
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
    text: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
    },
}, {
    timestamps: true,
});
commentSchema.index({ mediaId: 1, createdAt: -1 });
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
