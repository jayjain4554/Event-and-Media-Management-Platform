import { Router } from 'express';
import { getNotifications, markRead } from './notificationController';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.use(protect); // Secure all notification subroutes

router.get('/', getNotifications);
router.patch('/read', markRead);

export default router;
