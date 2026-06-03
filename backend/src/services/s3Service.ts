import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

// Helper to determine if S3 is active
const isAwsConfigured = (): boolean => {
  return !!(
    env.AWS_ACCESS_KEY_ID &&
    env.AWS_SECRET_ACCESS_KEY &&
    env.AWS_S3_BUCKET_NAME
  );
};

let s3Client: S3Client | null = null;

if (isAwsConfigured()) {
  s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
  logger.info('🚀 AWS S3 Media Service initialized successfully (Production Mode).');
} else {
  logger.warn('⚠️ AWS S3 credentials missing. Engaging local filesystem fallback (Mock Mode).');
}

export interface UploadResult {
  url: string;
  key: string;
}

export const uploadFile = async (
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResult> => {
  const fileExtension = path.extname(originalName);
  const uniqueKey = `media/${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;

  if (s3Client && env.AWS_S3_BUCKET_NAME) {
    // S3 Mode
    try {
      const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await s3Client.send(command);

      const url = env.CLOUDFRONT_URL
        ? `${env.CLOUDFRONT_URL}/${uniqueKey}`
        : `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

      return { url, key: uniqueKey };
    } catch (error: any) {
      logger.error(`❌ S3 Upload Error: ${error.message}`);
      throw error;
    }
  } else {
    // Local Mock Fallback Mode
    try {
      const localUploadsDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(localUploadsDir)) {
        fs.mkdirSync(localUploadsDir, { recursive: true });
      }

      const filePath = path.join(localUploadsDir, path.basename(uniqueKey));
      fs.writeFileSync(filePath, fileBuffer);

      const localPort = env.PORT || 5000;
      const url = `http://localhost:${localPort}/uploads/${path.basename(uniqueKey)}`;

      return { url, key: uniqueKey };
    } catch (error: any) {
      logger.error(`❌ Local Upload Mock Error: ${error.message}`);
      throw error;
    }
  }
};

export const deleteFile = async (key: string): Promise<void> => {
  if (s3Client && env.AWS_S3_BUCKET_NAME) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: key,
      });
      await s3Client.send(command);
      logger.info(`🗑️ S3 Media Deleted: ${key}`);
    } catch (error: any) {
      logger.error(`❌ S3 Deletion Error: ${error.message}`);
      throw error;
    }
  } else {
    try {
      const localUploadsDir = path.join(__dirname, '../../public/uploads');
      const filePath = path.join(localUploadsDir, path.basename(key));

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`🗑️ Local Mock Media Deleted: ${key}`);
      } else {
        logger.warn(`🗑️ File not found for local deletion: ${key}`);
      }
    } catch (error: any) {
      logger.error(`❌ Local Mock Deletion Error: ${error.message}`);
      throw error;
    }
  }
};
