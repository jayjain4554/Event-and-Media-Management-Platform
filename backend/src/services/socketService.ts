import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

let io: SocketIOServer | null = null;
const userSocketsMap = new Map<string, string[]>(); // Map of UserId -> SocketIds[]

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // In production, customize to frontend domain
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.debug(`🔌 Socket Connected: ${socket.id}`);

    // Authentication handshake via token query
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    let userId: string | null = null;

    if (token && typeof token === 'string') {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        userId = decoded.id;
        
        // Map user ID to socket
        const activeSockets = userSocketsMap.get(userId) || [];
        activeSockets.push(socket.id);
        userSocketsMap.set(userId, activeSockets);
        logger.debug(`👤 User ${userId} authenticated on socket ${socket.id}`);
      } catch (err) {
        logger.debug(`⚠️ Invalid token handshake on socket ${socket.id}`);
      }
    }

    // Join room for dynamic events (e.g. event-specific likes/comments)
    socket.on('join_event', (eventId: string) => {
      socket.join(`event_${eventId}`);
      logger.debug(`🔌 Socket ${socket.id} joined event room: event_${eventId}`);
    });

    socket.on('leave_event', (eventId: string) => {
      socket.leave(`event_${eventId}`);
      logger.debug(`🔌 Socket ${socket.id} left event room: event_${eventId}`);
    });

    socket.on('disconnect', () => {
      logger.debug(`🔌 Socket Disconnected: ${socket.id}`);
      
      // Clean up maps
      if (userId) {
        const activeSockets = userSocketsMap.get(userId) || [];
        const remainingSockets = activeSockets.filter((id) => id !== socket.id);
        if (remainingSockets.length > 0) {
          userSocketsMap.set(userId, remainingSockets);
        } else {
          userSocketsMap.delete(userId);
        }
        logger.debug(`👤 Cleaned up sockets for user ${userId}`);
      }
    });
  });

  logger.info('🚀 Socket.IO real-time engine initialized successfully.');
  return io;
};

// Send direct notification to a specific online user
export const sendNotificationToUser = (userId: string, notification: any): boolean => {
  if (!io) {
    logger.error('❌ Cannot send notification: Socket.IO not initialized');
    return false;
  }

  const socketIds = userSocketsMap.get(userId);
  if (socketIds && socketIds.length > 0) {
    socketIds.forEach((socketId) => {
      io!.to(socketId).emit('notification', notification);
    });
    logger.debug(`🔔 Direct notification emitted to user ${userId} via ${socketIds.length} sockets`);
    return true;
  }
  
  logger.debug(`🔔 Notification queued (user ${userId} is currently offline)`);
  return false;
};

// Broadcast updates (likes/comments) to all clients currently viewing a specific event page
export const broadcastToEvent = (eventId: string, eventName: string, data: any): void => {
  if (!io) return;
  io.to(`event_${eventId}`).emit(eventName, data);
  logger.debug(`📢 Broadcasted event update "${eventName}" to room event_${eventId}`);
};
