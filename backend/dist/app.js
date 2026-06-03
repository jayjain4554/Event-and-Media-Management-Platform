"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const errors_1 = require("./shared/errors");
const logger_1 = require("./utils/logger");
// Route Imports
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const userRoutes_1 = __importDefault(require("./modules/user/userRoutes"));
const eventRoutes_1 = __importDefault(require("./modules/event/eventRoutes"));
const mediaRoutes_1 = __importDefault(require("./modules/media/mediaRoutes"));
const aiRoutes_1 = __importDefault(require("./modules/ai/aiRoutes"));
const notificationRoutes_1 = __importDefault(require("./modules/notification/notificationRoutes"));
const adminRoutes_1 = __importDefault(require("./modules/admin/adminRoutes"));
const favorite_routes_1 = __importDefault(require("./modules/favorite/favorite.routes"));
const app = (0, express_1.default)();
// 1. Security Headers via Helmet
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Required to allow images to load across domains in development
}));
// 2. CORS configuration
app.use((0, cors_1.default)({
    origin: '*', // Customize to frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// 3. HTTP Request Logging via Morgan
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use((0, morgan_1.default)(morganFormat, {
    stream: { write: (message) => logger_1.logger.http(message.trim()) }
}));
// 4. Rate Limiting to prevent brute-force/DDOS
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per window
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);
// 5. Body Parsing with limits
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 6. Data Sanitization against NoSQL Query Injection
app.use((0, express_mongo_sanitize_1.default)());
// 7. Serve Uploaded Files Statically (Mock Local Uploads Directory)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// 8. Register API Endpoints
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/media', mediaRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/favorites', favorite_routes_1.default);
// Unhandled Route Fallback
app.all('*', (req, res, next) => {
    next(new errors_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Central Error Interceptor Middleware
app.use(errorMiddleware_1.globalErrorHandler);
exports.default = app;
