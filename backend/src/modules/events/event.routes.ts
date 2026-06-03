import { Router } from 'express';
import { createEvent, updateEvent, deleteEvent, getEvent, getEvents } from './event.controller';
import { createEventSchema, updateEventSchema, queryEventSchema } from './event.validation';
import { validateRequest } from '../../middleware/validationMiddleware';
import { protect, restrictTo } from '../auth/auth.middleware';

const router = Router();

router.get('/', validateRequest(queryEventSchema), getEvents);
router.get('/:id', getEvent);

// Protected actions for creating, updating, and deleting events
router.post(
  '/',
  protect,
  restrictTo('Admin', 'Photographer'),
  validateRequest(createEventSchema),
  createEvent
);

router.put(
  '/:id',
  protect,
  restrictTo('Admin', 'Photographer'),
  validateRequest(updateEventSchema),
  updateEvent
);

router.delete(
  '/:id',
  protect,
  restrictTo('Admin'),
  deleteEvent
);

export default router;
