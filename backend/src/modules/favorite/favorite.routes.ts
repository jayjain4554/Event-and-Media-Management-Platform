import { Router } from 'express';
import { toggleFavorite, getMyFavorites } from './favorite.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

// Protect all routes
router.use(protect);

router.post('/toggle', toggleFavorite);
router.get('/', getMyFavorites);

export default router;
