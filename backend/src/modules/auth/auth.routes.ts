import { Router } from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller';
import { registerSchema, loginSchema, refreshSchema } from './auth.validation';
import { validateRequest } from '../../middleware/validationMiddleware';
import { protect } from './auth.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshSchema), refresh);
router.post('/logout', logout);

// Authenticated protected routes
router.get('/me', protect, getMe);

export default router;
