import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';

import { globalErrorHandler } from './middleware/errorMiddleware';
import { AppError } from './shared/errors';
import { logger } from './utils/logger';

// Route Imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/userRoutes';
import eventRoutes from './modules/event/eventRoutes';
import mediaRoutes from './modules/media/mediaRoutes';
import aiRoutes from './modules/ai/aiRoutes';
import notificationRoutes from './modules/notification/notificationRoutes';
import adminRoutes from './modules/admin/adminRoutes';
import favoriteRoutes from './modules/favorite/favorite.routes';

const app = express();

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Required to allow images to load across domains in development
}));

// 2. CORS configuration
app.use(cors({
  origin: '*', // Customize to frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 3. HTTP Request Logging via Morgan
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.http(message.trim()) }
}));

// 4. Rate Limiting to prevent brute-force/DDOS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  message: 'Too many requests from this IP. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// 5. Body Parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// 7. Serve Uploaded Files Statically (Mock Local Uploads Directory)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 8. Register API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);

// Unhandled Route Fallback
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Central Error Interceptor Middleware
app.use(globalErrorHandler);

export default app;
