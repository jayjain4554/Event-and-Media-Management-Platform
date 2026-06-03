"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errors_1 = require("../shared/errors");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Assign validated values back to request, but preserve originals when schema didn't validate that section
            req.body = parsed.body ?? req.body;
            req.query = parsed.query ?? req.query;
            req.params = parsed.params ?? req.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.slice(1).join('.'),
                    message: err.message,
                }));
                return next(new errors_1.AppError('Request validation failed', 400, errors));
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
