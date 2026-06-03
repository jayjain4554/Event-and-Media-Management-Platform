"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlbumSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
exports.createEventSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, { message: 'Title must be at least 3 characters long' }),
        description: zod_1.z.string().min(10, { message: 'Description must be at least 10 characters long' }).optional().or(zod_1.z.literal('')),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Must be a valid date string' }),
        location: zod_1.z.string().min(2, { message: 'Location is required' }),
        category: zod_1.z.string().min(2, { message: 'Category is required' }),
        coverImage: zod_1.z.string().url({ message: 'Cover image must be a valid URL' }).optional().or(zod_1.z.literal('')),
        visibility: zod_1.z.enum(['public', 'private']).default('public'),
    }),
});
exports.updateEventSchema = zod_1.z.object({
    body: exports.createEventSchema.shape.body.partial(),
});
exports.createAlbumSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2, { message: 'Album title must be at least 2 characters long' }),
        description: zod_1.z.string().optional(),
        coverImage: zod_1.z.string().url({ message: 'Cover image must be a valid URL' }).optional(),
    }),
});
