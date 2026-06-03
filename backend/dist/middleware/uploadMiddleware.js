"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../shared/errors");
// Configure multer to store in memory
const memoryStorage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/jpg',
        'video/mp4',
        'video/quicktime', // MOV
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.AppError('Unsupported file type. Only JPEG, JPG, PNG, WEBP, and MP4/MOV videos are permitted.', 400), false);
    }
};
// Limit uploads to 10MB for images, 50MB for videos.
// Multer has a limits option where we set max size. We'll set it to 50MB generally, and check specifically in routes if needed.
exports.upload = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB general limit
    },
});
