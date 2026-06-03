"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaSearchSchema = exports.addCommentSchema = void 0;
const zod_1 = require("zod");
exports.addCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1, { message: 'Comment text cannot be empty' }),
    }),
});
exports.mediaSearchSchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        eventId: zod_1.z.string().optional(),
        albumId: zod_1.z.string().optional(),
        tag: zod_1.z.string().optional(),
        visibility: zod_1.z.enum(['public', 'private']).optional(),
        limit: zod_1.z.coerce.number().default(20),
        cursor: zod_1.z.string().optional(),
    }),
});
