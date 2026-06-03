import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  createAlbum,
  getAlbums,
} from './eventController';
import { createEventSchema, updateEventSchema, createAlbumSchema } from './eventSchema';
import { validateRequest } from '../../middleware/validationMiddleware';
import { protect } from '../../middleware/authMiddleware';
import { restrictTo } from '../../middleware/roleMiddleware';
import { checkEventAccess } from '../../middleware/accessControlMiddleware';

const router = Router();

// Publicly accessible with dynamic privacy parsing inside the controllers
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected: Admin and Photographer operations
router.post(
  '/',
  protect,
  restrictTo('Admin', 'Photographer'),
  validateRequest(createEventSchema),
  createEvent
);

router.patch(
  '/:id',
  protect,
  restrictTo('Admin', 'Photographer'),
  validateRequest(updateEventSchema),
  updateEvent
);

router.delete('/:id', protect, restrictTo('Admin', 'Photographer'), deleteEvent);

// Album CRUD sub-routes
router.get('/:eventId/albums', checkEventAccess, getAlbums);
router.post(
  '/:eventId/albums',
  protect,
  restrictTo('Admin', 'Photographer'),
  checkEventAccess,
  validateRequest(createAlbumSchema),
  createAlbum
);

export default router;
