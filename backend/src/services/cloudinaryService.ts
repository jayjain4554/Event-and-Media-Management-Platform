import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  thumbnailUrl: string;
  resourceType: 'image' | 'video';
}

const isCloudinaryConfigured = (): boolean => {
  return !!(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info('🚀 Cloudinary Media Service initialized successfully.');
} else {
  logger.warn('⚠️ Cloudinary is not configured. Using local upload fallback for media.');
}

const buildThumbnailUrl = (publicId: string, resourceType: 'image' | 'video') => {
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType,
    transformation: resourceType === 'video'
      ? [{ width: 400, height: 225, crop: 'fill', quality: 'auto', fetch_format: 'auto' }]
      : [{ width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
  });
};

export const uploadCloudinaryFile = async (
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<CloudinaryUploadResult> => {
  const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
  const publicIdBase = `eventsphere/${Date.now()}-${path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9_-]/g, '_')}`;

  if (isCloudinaryConfigured()) {
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicIdBase,
          resource_type: resourceType,
          folder: 'eventsphere',
          chunk_size: 6000000,
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            logger.error(`❌ Cloudinary Upload Error: ${error.message}`);
            return reject(error);
          }

          if (!result) {
            return reject(new Error('Cloudinary did not return upload metadata.'));
          }

          const secureUrl = result.secure_url || result.url || '';
          const thumbnailUrl = buildThumbnailUrl(result.public_id, result.resource_type as 'image' | 'video');

          resolve({
            publicId: result.public_id,
            secureUrl,
            thumbnailUrl,
            resourceType: result.resource_type as 'image' | 'video',
          });
        }
      );

      const stream = new PassThrough();
      stream.end(fileBuffer);
      stream.pipe(uploadStream);
    });
  }

  const localUploadsDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }

  const fileExtension = path.extname(originalName);
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
  const filePath = path.join(localUploadsDir, filename);
  fs.writeFileSync(filePath, fileBuffer);

  const localPort = env.PORT || 5000;
  const secureUrl = `http://localhost:${localPort}/uploads/${filename}`;
  const thumbnailUrl = secureUrl;

  return {
    publicId: filename,
    secureUrl,
    thumbnailUrl,
    resourceType,
  };
};
