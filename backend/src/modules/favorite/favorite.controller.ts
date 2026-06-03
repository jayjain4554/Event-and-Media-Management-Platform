import { Response, NextFunction } from 'express';
import { favoriteService } from './favorite.service';
import { AuthenticatedRequest } from '../../shared/types';
import { AppError } from '../../shared/errors';

export const toggleFavorite = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const { mediaId } = req.body;
    if (!mediaId) {
      return next(new AppError('Media ID is required.', 400));
    }

    const result = await favoriteService.toggleFavorite(mediaId, req.user._id.toString());

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyFavorites = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const favorites = await favoriteService.getFavorites(req.user._id.toString());

    res.status(200).json({
      status: 'success',
      data: { favorites },
    });
  } catch (error) {
    next(error);
  }
};
