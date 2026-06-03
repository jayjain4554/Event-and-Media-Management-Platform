import { Router } from 'express';
import { getDashboardMetrics } from './adminController';
import { protect } from '../../middleware/authMiddleware';
import { restrictTo } from '../../middleware/roleMiddleware';

const router = Router();

// Protected: Restricted solely to Admin users
router.get('/metrics', protect, restrictTo('Admin'), getDashboardMetrics);

export default router;
