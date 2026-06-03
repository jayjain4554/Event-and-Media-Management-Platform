"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, { message: 'Name must be at least 2 characters long' }),
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        password: zod_1.z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        role: zod_1.z.enum(['Admin', 'Photographer', 'ClubMember', 'Viewer']).default('Viewer'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        password: zod_1.z.string().min(1, { message: 'Password is required' }),
    }),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, { message: 'Refresh token is required' }),
    }),
});
