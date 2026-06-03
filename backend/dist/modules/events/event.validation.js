"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryEventSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2, { message: 'Title must be at least 2 characters long' }),
        description: zod_1.z.string().min(10, { message: 'Description must be at least 10 characters long' }),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid event date' }),
        location: zod_1.z.string().min(2, { message: 'Location is required' }),
        category: zod_1.z.string().min(1, { message: 'Category is required' }),
        coverImage: zod_1.z.string().min(1, { message: 'Cover image is required' }),
        visibility: zod_1.z.enum(['public', 'private']).default('public'),
    }),
});
exports.updateEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2).optional(),
        description: zod_1.z.string().min(10).optional(),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
        location: zod_1.z.string().min(2).optional(),
        category: zod_1.z.string().min(1).optional(),
        coverImage: zod_1.z.string().min(1).optional(),
        visibility: zod_1.z.enum(['public', 'private']).optional(),
    }),
});
exports.queryEventSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        category: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        sort: zod_1.z.enum(['latest', 'oldest', 'name']).optional(),
    }),
});
