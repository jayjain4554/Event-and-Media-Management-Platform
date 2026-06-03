import { Response, NextFunction } from 'express';
import { Event } from './eventModel';
import { Album } from './albumModel';
import { AppError } from '../../shared/errors';
import { AuthenticatedRequest } from '../../shared/types';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../user/userModel';
import { Media } from '../media/mediaModel';

export const createEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const newEvent = await Event.create(eventData);

    res.status(201).json({
      status: 'success',
      data: { event: newEvent },
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { category, search, sort } = req.query;

    // Access control filtering
    let allowedVisibility: string[] = ['public'];
    
    // Check if user has an auth token sent in headers
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        const user = await User.findById(decoded.id);
        if (user && ['Admin', 'Photographer', 'ClubMember'].includes(user.role)) {
          allowedVisibility = ['public', 'private'];
        }
      } catch (err) {
        // Token invalid, treat as guest (only public events)
      }
    }

    const filterQuery: any = {
      visibility: { $in: allowedVisibility },
    };

    if (category) {
      filterQuery.category = category;
    }

    if (search) {
      filterQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    let sortQuery: any = { date: -1 }; // default: latest events first
    if (sort === 'oldest') {
      sortQuery = { date: 1 };
    } else if (sort === 'name') {
      sortQuery = { title: 1 };
    }

    const events = await Event.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    const total = await Event.countDocuments(filterQuery);

    // Dynamic addition of media count per event
    const eventsWithMediaCount = await Promise.all(
      events.map(async (event) => {
        const mediaCount = await Media.countDocuments({ eventId: event._id });
        return {
          ...event.toObject(),
          mediaCount,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      results: events.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { events: eventsWithMediaCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return next(new AppError('No event found with that ID.', 404));
    }

    // Access control for private events
    if (event.visibility === 'private') {
      let authorized = false;
      let token: string | undefined;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (token) {
        try {
          const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
          const user = await User.findById(decoded.id);
          if (user && ['Admin', 'Photographer', 'ClubMember'].includes(user.role)) {
            authorized = true;
          }
        } catch (err) {
          // Token invalid
        }
      }

      if (!authorized) {
        return next(new AppError('This is a private event. Registered club members only.', 403));
      }
    }

    const mediaCount = await Media.countDocuments({ eventId: event._id });

    res.status(200).json({
      status: 'success',
      data: {
        event: {
          ...event.toObject(),
          mediaCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return next(new AppError('No event found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return next(new AppError('No event found with that ID.', 404));
    }

    // Clean up related media and albums in background
    await Album.deleteMany({ eventId: event._id });
    await Media.deleteMany({ eventId: event._id });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Album controllers
export const createAlbum = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params?.eventId || req.body?.eventId;
    if (!eventId) {
      return next(new AppError('Event ID is required to create an album.', 400));
    }

    const albumData = {
      ...req.body,
      eventId,
    };

    const newAlbum = await Album.create(albumData);

    res.status(201).json({
      status: 'success',
      data: { album: newAlbum },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbums = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.params;
    const albums = await Album.find({ eventId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: albums.length,
      data: { albums },
    });
  } catch (error) {
    next(error);
  }
};
