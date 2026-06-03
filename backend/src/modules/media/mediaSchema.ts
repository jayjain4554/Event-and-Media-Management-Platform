import { z } from 'zod';

export const addCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1, { message: 'Comment text cannot be empty' }),
  }),
});

export const mediaSearchSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    eventId: z.string().optional(),
    albumId: z.string().optional(),
    tag: z.string().optional(),
    visibility: z.enum(['public', 'private']).optional(),
    limit: z.coerce.number().default(20),
    cursor: z.string().optional(),
  }),
});
