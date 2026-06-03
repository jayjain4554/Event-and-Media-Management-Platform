import { Router } from 'express';
import { register, login, getMe, searchUsers, uploadSelfie } from './userController';
import { signupSchema, loginSchema } from './userSchema';
import { validateRequest } from '../../middleware/validationMiddleware';
import { protect } from '../../middleware/authMiddleware';
import { upload } from '../../middleware/uploadMiddleware';

const router = Router();

router.post('/signup', validateRequest(signupSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Authenticated protected routes
router.get('/me', protect, getMe);
router.get('/search', protect, searchUsers);
router.post('/selfie', protect, upload.single('selfie'), uploadSelfie);

export default router;
