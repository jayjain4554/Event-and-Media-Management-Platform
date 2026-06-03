import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (socket?.connected) return socket;

  // In production, connects to absolute root backend URL; in development, relative or blank connects to proxy
  socket = io('/', {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('🔌 Realtime push socket established successfully:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Realtime push socket disconnected');
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinEventRoom = (eventId: string): void => {
  if (socket?.connected) {
    socket.emit('join_event', eventId);
  }
};

export const leaveEventRoom = (eventId: string): void => {
  if (socket?.connected) {
    socket.emit('leave_event', eventId);
  }
};
