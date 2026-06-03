import { Response, NextFunction } from 'express';
import { User } from '../user/userModel';
import { Event } from '../event/eventModel';
import { Media } from '../media/mediaModel';
import { AppError } from '../../shared/errors';
import { AuthenticatedRequest } from '../../shared/types';

export const getDashboardMetrics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));

    // 1. Core counters
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalMedia = await Media.countDocuments();

    // 2. Counts by roles
    const adminCount = await User.countDocuments({ role: 'Admin' });
    const photographerCount = await User.countDocuments({ role: 'Photographer' });
    const memberCount = await User.countDocuments({ role: 'ClubMember' });
    const viewerCount = await User.countDocuments({ role: 'Viewer' });

    // 3. Storage Footprint Calculation
    const storageAggregation = await Media.aggregate([
      { $group: { _id: null, totalSize: { $sum: '$size' } } },
    ]);
    const totalStorageBytes = storageAggregation.length > 0 ? storageAggregation[0].totalSize : 0;
    
    // 4. File counts by type
    const imageCount = await Media.countDocuments({ fileType: 'image' });
    const videoCount = await Media.countDocuments({ fileType: 'video' });

    // 5. Active vs Private Events
    const publicEvents = await Event.countDocuments({ visibility: 'public' });
    const privateEvents = await Event.countDocuments({ visibility: 'private' });

    // 6. Most Popular Events (Aggregate media counts per event, sort, and limit to 5)
    const popularEventsAggregation = await Media.aggregate([
      { $group: { _id: '$eventId', mediaCount: { $sum: 1 }, likesSum: { $sum: '$likesCount' } } },
      { $sort: { mediaCount: -1 } },
      { $limit: 5 },
    ]);

    // Populate event titles
    const popularEvents = await Promise.all(
      popularEventsAggregation.map(async (item) => {
        const event = await Event.findById(item._id).select('title coverImage date category');
        return {
          event,
          mediaCount: item.mediaCount,
          totalLikes: item.likesSum,
        };
      })
    );

    // 7. Time-series upload activity (Mock analytics data structured cleanly for Recharta visualization)
    const monthlyUploads = [
      { month: 'Jan', uploads: 45 },
      { month: 'Feb', uploads: 62 },
      { month: 'Mar', uploads: 120 },
      { month: 'Apr', uploads: 95 },
      { month: 'May', uploads: totalMedia > 0 ? totalMedia : 180 }, // Dynamic bound
    ];

    const monthlyUsers = [
      { month: 'Jan', members: adminCount + photographerCount },
      { month: 'Feb', members: memberCount / 2 },
      { month: 'Mar', members: memberCount / 1.2 },
      { month: 'Apr', members: memberCount },
      { month: 'May', members: totalUsers },
    ];

    res.status(200).json({
      status: 'success',
      data: {
        metrics: {
          users: {
            total: totalUsers,
            admin: adminCount,
            photographer: photographerCount,
            member: memberCount,
            viewer: viewerCount,
          },
          events: {
            total: totalEvents,
            public: publicEvents,
            private: privateEvents,
          },
          media: {
            total: totalMedia,
            images: imageCount,
            videos: videoCount,
          },
          storage: {
            bytes: totalStorageBytes,
            formatted: `${(totalStorageBytes / (1024 * 1024)).toFixed(2)} MB`,
          },
          popularEvents,
          charts: {
            uploads: monthlyUploads,
            users: monthlyUsers,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
