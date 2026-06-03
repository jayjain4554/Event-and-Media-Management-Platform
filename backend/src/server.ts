import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';
import { initializeSocket } from './services/socketService';
import { logger } from './utils/logger';

// Uncaught Exceptions handling
process.on('uncaughtException', (err: Error) => {
  logger.error('❌ UNCAUGHT EXCEPTION! Shutting down server...');
  logger.error(`${err.name}: ${err.message}`);
  if (err.stack) logger.error(err.stack);
  process.exit(1);
});

const startServer = async () => {
  // 1. Establish Database Connection
  await connectDB();

  // 2. Wrap HTTP Server around Express
  const server = http.createServer(app);

  // 3. Mount real-time push socket engine
  initializeSocket(server);

  // 4. Start listening
  const port = env.PORT || 5000;
  const runningServer = server.listen(port, () => {
    logger.info(`✨ Server running in [${env.NODE_ENV}] mode on port: ${port}`);
  });

  // Unhandled Promise Rejections catcher
  process.on('unhandledRejection', (err: any) => {
    logger.error('❌ UNHANDLED REJECTION! Shutting down server gracefully...');
    logger.error(`${err?.name || 'Error'}: ${err?.message || err}`);
    runningServer.close(() => {
      process.exit(1);
    });
  });
};

startServer();
