import { Event } from './event.model';
import { Album } from '../event/albumModel';
import { Media } from '../media/mediaModel';
import { AppError } from '../../shared/errors';
import { CreateEventInput, UpdateEventInput, EventQueryFilters } from './event.types';

export class EventService {
  /**
   * Create a new event
   */
  public async createEvent(data: CreateEventInput, createdBy: string) {
    const event = await Event.create({
      ...data,
      createdBy,
    });
    return event;
  }

  /**
   * Update an existing event
   */
  public async updateEvent(id: string, data: UpdateEventInput) {
    const event = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      throw new AppError('No event found with that ID.', 404);
    }
    return event;
  }

  /**
   * Delete an event and clean up all associated albums and media
   */
  public async deleteEvent(id: string) {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new AppError('No event found with that ID.', 404);
    }

    // Cascading deletion of related albums and media in the background
    await Album.deleteMany({ eventId: event._id });
    await Media.deleteMany({ eventId: event._id });

    return event;
  }

  /**
   * Get a single event by ID with accessibility check based on role
   */
  public async getEventById(id: string, currentUserRole?: string) {
    const event = await Event.findById(id).populate('createdBy', 'name email');
    if (!event) {
      throw new AppError('No event found with that ID.', 404);
    }

    // Role-based visibility check for private events
    if (event.visibility === 'private') {
      const isAuthorized = currentUserRole && ['Admin', 'Photographer', 'ClubMember'].includes(currentUserRole);
      if (!isAuthorized) {
        throw new AppError('This is a private event. Registered club members only.', 403);
      }
    }

    // Dynamic addition of associated media count
    const mediaCount = await Media.countDocuments({ eventId: event._id });

    return {
      ...event.toObject(),
      mediaCount,
    };
  }

  /**
   * Query all events with paginated searching, filtering, and role-based visibility restrictions
   */
  public async queryEvents(
    options: {
      category?: string;
      search?: string;
      sort?: 'latest' | 'oldest' | 'name';
      page?: number;
      limit?: number;
    },
    currentUserRole?: string
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    // Define visibility filter based on user roles
    const allowedVisibility = currentUserRole && ['Admin', 'Photographer', 'ClubMember'].includes(currentUserRole)
      ? ['public', 'private']
      : ['public'];

    const filterQuery: EventQueryFilters = {
      visibility: { $in: allowedVisibility as any },
    };

    if (options.category) {
      filterQuery.category = options.category;
    }

    if (options.search) {
      filterQuery.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } },
        { location: { $regex: options.search, $options: 'i' } },
      ];
    }

    // Build sort queries matching model indexes
    let sortQuery: any = { date: -1 }; // default: latest
    if (options.sort === 'oldest') {
      sortQuery = { date: 1 };
    } else if (options.sort === 'name') {
      sortQuery = { title: 1 };
    }

    const events = await Event.find(filterQuery as any)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    const total = await Event.countDocuments(filterQuery as any);

    // Compute media counts for each event
    const eventsWithMediaCount = await Promise.all(
      events.map(async (event) => {
        const mediaCount = await Media.countDocuments({ eventId: event._id });
        return {
          ...event.toObject(),
          mediaCount,
        };
      })
    );

    return {
      events: eventsWithMediaCount,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}

export const eventService = new EventService();
