import { Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { Event } from '../modules/event/eventModel';
import { AuthenticatedRequest } from '../shared/types';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../modules/user/userModel';

export const checkEventAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = req.params.eventId || req.body.eventId;
    
    if (!eventId) {
      return next(new AppError('Event ID is required for access control verification.', 400));
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('No event found with that ID.', 404));
    }

    // Public event: accessible to everyone
    if (event.visibility === 'public') {
      return next();
    }

    // Private event: requires authenticated Admin, Photographer, or ClubMember
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('This event is private. Please log in to view.', 401));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('Authentication user no longer exists.', 401));
    }

    // Allowed roles for private albums: Admin, Photographer, ClubMember
    if (['Admin', 'Photographer', 'ClubMember'].includes(user.role)) {
      req.user = user; // Attach authenticated context
      return next();
    }

    return next(
      new AppError('Access denied. Private events are restricted to registered members.', 403)
    );
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Private resource. Authentication failed.', 401));
    }
    next(error);
  }
};
