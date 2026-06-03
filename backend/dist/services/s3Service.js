"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Helper to determine if S3 is active
const isAwsConfigured = () => {
    return !!(env_1.env.AWS_ACCESS_KEY_ID &&
        env_1.env.AWS_SECRET_ACCESS_KEY &&
        env_1.env.AWS_S3_BUCKET_NAME);
};
let s3Client = null;
if (isAwsConfigured()) {
    s3Client = new client_s3_1.S3Client({
        region: env_1.env.AWS_REGION,
        credentials: {
            accessKeyId: env_1.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: env_1.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });
    logger_1.logger.info('🚀 AWS S3 Media Service initialized successfully (Production Mode).');
}
else {
    logger_1.logger.warn('⚠️ AWS S3 credentials missing. Engaging local filesystem fallback (Mock Mode).');
}
const uploadFile = async (fileBuffer, originalName, mimeType) => {
    const fileExtension = path_1.default.extname(originalName);
    const uniqueKey = `media/${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    if (s3Client && env_1.env.AWS_S3_BUCKET_NAME) {
        // S3 Mode
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: env_1.env.AWS_S3_BUCKET_NAME,
                Key: uniqueKey,
                Body: fileBuffer,
                ContentType: mimeType,
            });
            await s3Client.send(command);
            const url = env_1.env.CLOUDFRONT_URL
                ? `${env_1.env.CLOUDFRONT_URL}/${uniqueKey}`
                : `https://${env_1.env.AWS_S3_BUCKET_NAME}.s3.${env_1.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;
            return { url, key: uniqueKey };
        }
        catch (error) {
            logger_1.logger.error(`❌ S3 Upload Error: ${error.message}`);
            throw error;
        }
    }
    else {
        // Local Mock Fallback Mode
        try {
            const localUploadsDir = path_1.default.join(__dirname, '../../public/uploads');
            if (!fs_1.default.existsSync(localUploadsDir)) {
                fs_1.default.mkdirSync(localUploadsDir, { recursive: true });
            }
            const filePath = path_1.default.join(localUploadsDir, path_1.default.basename(uniqueKey));
            fs_1.default.writeFileSync(filePath, fileBuffer);
            const localPort = env_1.env.PORT || 5000;
            const url = `http://localhost:${localPort}/uploads/${path_1.default.basename(uniqueKey)}`;
            return { url, key: uniqueKey };
        }
        catch (error) {
            logger_1.logger.error(`❌ Local Upload Mock Error: ${error.message}`);
            throw error;
        }
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (key) => {
    if (s3Client && env_1.env.AWS_S3_BUCKET_NAME) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: env_1.env.AWS_S3_BUCKET_NAME,
                Key: key,
            });
            await s3Client.send(command);
            logger_1.logger.info(`🗑️ S3 Media Deleted: ${key}`);
        }
        catch (error) {
            logger_1.logger.error(`❌ S3 Deletion Error: ${error.message}`);
            throw error;
        }
    }
    else {
        try {
            const localUploadsDir = path_1.default.join(__dirname, '../../public/uploads');
            const filePath = path_1.default.join(localUploadsDir, path_1.default.basename(key));
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                logger_1.logger.info(`🗑️ Local Mock Media Deleted: ${key}`);
            }
            else {
                logger_1.logger.warn(`🗑️ File not found for local deletion: ${key}`);
            }
        }
        catch (error) {
            logger_1.logger.error(`❌ Local Mock Deletion Error: ${error.message}`);
            throw error;
        }
    }
};
exports.deleteFile = deleteFile;
