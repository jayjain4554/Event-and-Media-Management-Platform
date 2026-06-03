"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCloudinaryFile = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const isCloudinaryConfigured = () => {
    return !!(env_1.env.CLOUDINARY_CLOUD_NAME &&
        env_1.env.CLOUDINARY_API_KEY &&
        env_1.env.CLOUDINARY_API_SECRET);
};
if (isCloudinaryConfigured()) {
    cloudinary_1.v2.config({
        cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.env.CLOUDINARY_API_KEY,
        api_secret: env_1.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    logger_1.logger.info('🚀 Cloudinary Media Service initialized successfully.');
}
else {
    logger_1.logger.warn('⚠️ Cloudinary is not configured. Using local upload fallback for media.');
}
const buildThumbnailUrl = (publicId, resourceType) => {
    return cloudinary_1.v2.url(publicId, {
        secure: true,
        resource_type: resourceType,
        transformation: resourceType === 'video'
            ? [{ width: 400, height: 225, crop: 'fill', quality: 'auto', fetch_format: 'auto' }]
            : [{ width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
    });
};
const uploadCloudinaryFile = async (fileBuffer, originalName, mimeType) => {
    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
    const publicIdBase = `eventsphere/${Date.now()}-${path_1.default.basename(originalName, path_1.default.extname(originalName)).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    if (isCloudinaryConfigured()) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                public_id: publicIdBase,
                resource_type: resourceType,
                folder: 'eventsphere',
                chunk_size: 6000000,
                quality: 'auto',
                fetch_format: 'auto',
            }, (error, result) => {
                if (error) {
                    logger_1.logger.error(`❌ Cloudinary Upload Error: ${error.message}`);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary did not return upload metadata.'));
                }
                const secureUrl = result.secure_url || result.url || '';
                const thumbnailUrl = buildThumbnailUrl(result.public_id, result.resource_type);
                resolve({
                    publicId: result.public_id,
                    secureUrl,
                    thumbnailUrl,
                    resourceType: result.resource_type,
                });
            });
            const stream = new stream_1.PassThrough();
            stream.end(fileBuffer);
            stream.pipe(uploadStream);
        });
    }
    const localUploadsDir = path_1.default.join(__dirname, '../../public/uploads');
    if (!fs_1.default.existsSync(localUploadsDir)) {
        fs_1.default.mkdirSync(localUploadsDir, { recursive: true });
    }
    const fileExtension = path_1.default.extname(originalName);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    const filePath = path_1.default.join(localUploadsDir, filename);
    fs_1.default.writeFileSync(filePath, fileBuffer);
    const localPort = env_1.env.PORT || 5000;
    const secureUrl = `http://localhost:${localPort}/uploads/${filename}`;
    const thumbnailUrl = secureUrl;
    return {
        publicId: filename,
        secureUrl,
        thumbnailUrl,
        resourceType,
    };
};
exports.uploadCloudinaryFile = uploadCloudinaryFile;
