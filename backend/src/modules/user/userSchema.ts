import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    role: z.enum(['Admin', 'Photographer', 'ClubMember', 'Viewer']).default('Viewer'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});
