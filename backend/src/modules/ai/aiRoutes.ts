import { Router } from 'express';
import { getMySpottedMedia } from './aiController';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

// Protected: Retrieves media items where current user has been identified
router.get('/spotted', protect, getMySpottedMedia);

export default router;
