"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToEvent = exports.sendNotificationToUser = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
let io = null;
const userSocketsMap = new Map(); // Map of UserId -> SocketIds[]
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // In production, customize to frontend domain
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        logger_1.logger.debug(`🔌 Socket Connected: ${socket.id}`);
        // Authentication handshake via token query
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        let userId = null;
        if (token && typeof token === 'string') {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
                userId = decoded.id;
                // Map user ID to socket
                const activeSockets = userSocketsMap.get(userId) || [];
                activeSockets.push(socket.id);
                userSocketsMap.set(userId, activeSockets);
                logger_1.logger.debug(`👤 User ${userId} authenticated on socket ${socket.id}`);
            }
            catch (err) {
                logger_1.logger.debug(`⚠️ Invalid token handshake on socket ${socket.id}`);
            }
        }
        // Join room for dynamic events (e.g. event-specific likes/comments)
        socket.on('join_event', (eventId) => {
            socket.join(`event_${eventId}`);
            logger_1.logger.debug(`🔌 Socket ${socket.id} joined event room: event_${eventId}`);
        });
        socket.on('leave_event', (eventId) => {
            socket.leave(`event_${eventId}`);
            logger_1.logger.debug(`🔌 Socket ${socket.id} left event room: event_${eventId}`);
        });
        socket.on('disconnect', () => {
            logger_1.logger.debug(`🔌 Socket Disconnected: ${socket.id}`);
            // Clean up maps
            if (userId) {
                const activeSockets = userSocketsMap.get(userId) || [];
                const remainingSockets = activeSockets.filter((id) => id !== socket.id);
                if (remainingSockets.length > 0) {
                    userSocketsMap.set(userId, remainingSockets);
                }
                else {
                    userSocketsMap.delete(userId);
                }
                logger_1.logger.debug(`👤 Cleaned up sockets for user ${userId}`);
            }
        });
    });
    logger_1.logger.info('🚀 Socket.IO real-time engine initialized successfully.');
    return io;
};
exports.initializeSocket = initializeSocket;
// Send direct notification to a specific online user
const sendNotificationToUser = (userId, notification) => {
    if (!io) {
        logger_1.logger.error('❌ Cannot send notification: Socket.IO not initialized');
        return false;
    }
    const socketIds = userSocketsMap.get(userId);
    if (socketIds && socketIds.length > 0) {
        socketIds.forEach((socketId) => {
            io.to(socketId).emit('notification', notification);
        });
        logger_1.logger.debug(`🔔 Direct notification emitted to user ${userId} via ${socketIds.length} sockets`);
        return true;
    }
    logger_1.logger.debug(`🔔 Notification queued (user ${userId} is currently offline)`);
    return false;
};
exports.sendNotificationToUser = sendNotificationToUser;
// Broadcast updates (likes/comments) to all clients currently viewing a specific event page
const broadcastToEvent = (eventId, eventName, data) => {
    if (!io)
        return;
    io.to(`event_${eventId}`).emit(eventName, data);
    logger_1.logger.debug(`📢 Broadcasted event update "${eventName}" to room event_${eventId}`);
};
exports.broadcastToEvent = broadcastToEvent;
