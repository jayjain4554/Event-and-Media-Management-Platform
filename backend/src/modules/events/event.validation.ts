import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid event date' }),
    location: z.string().min(2, { message: 'Location is required' }),
    category: z.string().min(1, { message: 'Category is required' }),
    coverImage: z.string().min(1, { message: 'Cover image is required' }),
    visibility: z.enum(['public', 'private']).default('public'),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
    location: z.string().min(2).optional(),
    category: z.string().min(1).optional(),
    coverImage: z.string().min(1).optional(),
    visibility: z.enum(['public', 'private']).optional(),
  }),
});

export const queryEventSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['latest', 'oldest', 'name']).optional(),
  }),
});
