import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eventService } from './event.service';
import { AuthenticatedRequest } from '../../shared/types';
import { AppError } from '../../shared/errors';
import { env } from '../../config/env';
import { User } from '../user/userModel';

/**
 * Helper to identify user role when reading public/unprotected endpoints
 */
const getUserRoleFromRequest = async (req: AuthenticatedRequest): Promise<string | undefined> => {
  if (req.user) {
    return req.user.role;
  }

  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      if (user) {
        return user.role;
      }
    } catch (err) {
      // Token is invalid/expired; handle request as a guest reader
    }
  }
  return undefined;
};

export const createEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const newEvent = await eventService.createEvent(req.body, req.user._id.toString());

    res.status(201).json({
      status: 'success',
      data: { event: newEvent },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: { event: updatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await eventService.deleteEvent(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const role = await getUserRoleFromRequest(req);
    const event = await eventService.getEventById(req.params.id, role);

    res.status(200).json({
      status: 'success',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { category, search, sort } = req.query as Record<string, string>;

    const role = await getUserRoleFromRequest(req);

    const result = await eventService.queryEvents(
      {
        category,
        search,
        sort: sort as any,
        page,
        limit,
      },
      role
    );

    res.status(200).json({
      status: 'success',
      results: result.events.length,
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: { events: result.events },
    });
  } catch (error) {
    next(error);
  }
};
