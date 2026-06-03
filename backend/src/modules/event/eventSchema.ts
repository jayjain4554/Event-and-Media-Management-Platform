import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }).optional().or(z.literal('')),
    date: z.string().refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Must be a valid date string' }
    ),
    location: z.string().min(2, { message: 'Location is required' }),
    category: z.string().min(2, { message: 'Category is required' }),
    coverImage: z.string().url({ message: 'Cover image must be a valid URL' }).optional().or(z.literal('')),
    visibility: z.enum(['public', 'private']).default('public'),
  }),
});

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial(),
});

export const createAlbumSchema = z.object({
  body: z.object({
    title: z.string().min(2, { message: 'Album title must be at least 2 characters long' }),
    description: z.string().optional(),
    coverImage: z.string().url({ message: 'Cover image must be a valid URL' }).optional(),
  }),
});
