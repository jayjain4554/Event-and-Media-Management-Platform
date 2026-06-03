"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required'],
    },
    role: {
        type: String,
        enum: ['Admin', 'Photographer', 'ClubMember', 'Viewer'],
        default: 'Viewer',
        index: true,
    },
    referenceSelfieUrl: {
        type: String,
        default: '',
    },
    faceEmbedding: {
        type: [Number],
        default: undefined,
    },
    rekognitionFaceId: {
        type: String,
        default: '',
        index: true,
    },
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)('User', userSchema);
