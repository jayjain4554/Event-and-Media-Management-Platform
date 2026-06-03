import { Router } from 'express';
import {
  uploadMedia,
  getMedia,
  getMediaHighlights,
  getMediaTags,
  addMediaTag,
  removeMediaTag,
  toggleLike,
  addComment,
  getComments,
  downloadMedia,
} from './mediaController';
import { addCommentSchema } from './mediaSchema';
import { validateRequest } from '../../middleware/validationMiddleware';
import { protect } from '../../middleware/authMiddleware';
import { restrictTo } from '../../middleware/roleMiddleware';
import { checkEventAccess } from '../../middleware/accessControlMiddleware';
import { upload } from '../../middleware/uploadMiddleware';

const router = Router();

// Retrieve media in event (supports cursor pagination)
router.get('/event/:eventId', checkEventAccess, getMedia);

// Upload endpoint (photographers and admins, allows bulk array uploads)
router.post(
  '/',
  protect,
  restrictTo('Admin', 'Photographer'),
  upload.array('media', 10), // Limit to 10 files per bulk request
  uploadMedia
);

// Media highlights route
router.get('/highlights', getMediaHighlights);

// Media tag routes
router.get('/:mediaId/tags', protect, getMediaTags);
router.post('/:mediaId/tag', protect, addMediaTag);
router.delete('/:mediaId/tag/:userId', protect, removeMediaTag);

// Likes and comments routes
router.post('/:mediaId/like', protect, toggleLike);
router.get('/:mediaId/comment', getComments);
router.post(
  '/:mediaId/comment',
  protect,
  validateRequest(addCommentSchema),
  addComment
);

// Download dynamic watermarked resource
// Accessible to anyone who has access to the event
router.get('/:mediaId/download', downloadMedia);

export default router;
