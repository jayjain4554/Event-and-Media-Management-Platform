import { Response, NextFunction } from 'express';
import { Media } from '../media/mediaModel';
import { AppError } from '../../shared/errors';
import { AuthenticatedRequest } from '../../shared/types';

export const getMySpottedMedia = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Fast query exploiting the indexing on detectedFaces.matchedUserId
    const spottedMedia = await Media.find({
      'detectedFaces.matchedUserId': req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('eventId', 'title date coverImage visibility location category');

    const total = await Media.countDocuments({
      'detectedFaces.matchedUserId': req.user._id,
    });

    res.status(200).json({
      status: 'success',
      results: spottedMedia.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { media: spottedMedia },
    });
  } catch (error) {
    next(error);
  }
};
