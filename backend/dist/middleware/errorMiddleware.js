"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    logger_1.logger.error(`[API ERROR] ${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);
    if (err.stack) {
        logger_1.logger.error(err.stack);
    }
    if (env_1.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.errors,
            stack: err.stack,
            error: err,
        });
    }
    else {
        // Production Mode: Hide server internals
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                errors: err.errors,
            });
        }
        // Unhandled system or third-party errors
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong on the server',
        });
    }
};
exports.globalErrorHandler = globalErrorHandler;
