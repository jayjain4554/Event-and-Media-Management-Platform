"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const errors_1 = require("../shared/errors");
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication context is missing.', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
