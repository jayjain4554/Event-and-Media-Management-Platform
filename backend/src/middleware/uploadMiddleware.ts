import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../shared/errors';

// Configure multer to store in memory
const memoryStorage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  } else {
    cb(new AppError('Unsupported file type. Only JPEG, JPG, PNG, WEBP, and MP4/MOV videos are permitted.', 400) as any, false);
  }
};

// Limit uploads to 10MB for images, 50MB for videos.
// Multer has a limits option where we set max size. We'll set it to 50MB generally, and check specifically in routes if needed.
export const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB general limit
  },
});
