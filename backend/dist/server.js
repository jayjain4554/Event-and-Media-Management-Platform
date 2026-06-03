"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const socketService_1 = require("./services/socketService");
const logger_1 = require("./utils/logger");
// Uncaught Exceptions handling
process.on('uncaughtException', (err) => {
    logger_1.logger.error('❌ UNCAUGHT EXCEPTION! Shutting down server...');
    logger_1.logger.error(`${err.name}: ${err.message}`);
    if (err.stack)
        logger_1.logger.error(err.stack);
    process.exit(1);
});
const startServer = async () => {
    // 1. Establish Database Connection
    await (0, database_1.connectDB)();
    // 2. Wrap HTTP Server around Express
    const server = http_1.default.createServer(app_1.default);
    // 3. Mount real-time push socket engine
    (0, socketService_1.initializeSocket)(server);
    // 4. Start listening
    const port = env_1.env.PORT || 5000;
    const runningServer = server.listen(port, () => {
        logger_1.logger.info(`✨ Server running in [${env_1.env.NODE_ENV}] mode on port: ${port}`);
    });
    // Unhandled Promise Rejections catcher
    process.on('unhandledRejection', (err) => {
        logger_1.logger.error('❌ UNHANDLED REJECTION! Shutting down server gracefully...');
        logger_1.logger.error(`${err?.name || 'Error'}: ${err?.message || err}`);
        runningServer.close(() => {
            process.exit(1);
        });
    });
};
startServer();
