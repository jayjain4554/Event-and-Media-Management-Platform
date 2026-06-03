import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Media, IMediaFace } from './mediaModel';
import { Comment } from './commentModel';
import { Like } from './likeModel';
import { Favorite } from './favoriteModel';
import { Event } from '../event/eventModel';
import { User } from '../user/userModel';
import { Notification } from '../notification/notificationModel';
import { AppError } from '../../shared/errors';
import { AuthenticatedRequest } from '../../shared/types';
import { uploadCloudinaryFile } from '../../services/cloudinaryService';
import { detectLabels, detectFaces, computeCosineSimilarity, matchFacesInPhoto } from '../../services/rekognitionService';
import { applyWatermark } from '../../services/watermarkService';
import { sendNotificationToUser, broadcastToEvent } from '../../services/socketService';
import { env } from '../../config/env';

// Hash helper for duplicate detection
const computeBufferHash = (buffer: Buffer): string => {
  return crypto.createHash('md5').update(buffer).digest('hex');
};

const getAuthorizedViewer = async (req: AuthenticatedRequest) => {
  if (req.user) return req.user;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
};

export const uploadMedia = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const { eventId, albumId } = req.body;
    const visibility = req.body.visibility === 'private' ? 'private' : 'public';

    if (!eventId) {
      return next(new AppError('Event ID is required.', 400));
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Associated event not found.', 404));
    }

    // Capture file arrays (supports single or bulk array fields)
    const files = req.files as Express.Multer.File[] || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return next(new AppError('No media files provided for upload.', 400));
    }

    const uploadResults: any[] = [];
    const duplicateSkips: string[] = [];

    // Process uploaded files
    for (const file of files) {
      const duplicateHash = computeBufferHash(file.buffer);

      // 1. Duplicate Image Detection
      const existingMedia = await Media.findOne({ eventId, duplicateHash });
      if (existingMedia) {
        duplicateSkips.push(file.originalname);
        continue; // Skip uploading duplicate files to S3/DB
      }

      // 2. Upload original file to Cloudinary
      const uploadResult = await uploadCloudinaryFile(file.buffer, file.originalname, file.mimetype);
      const { publicId, secureUrl, thumbnailUrl, resourceType } = uploadResult;

      // 3. AI Features: Smart Image Tagging
      const tags = await detectLabels(file.buffer, file.originalname);

      // 4. AI Features: Facial Recognition & Personalized discovery
      // Run real AWS Rekognition collection matching flow (falls back to mock dynamically)
      const detectedFacesRaw = await matchFacesInPhoto(file.buffer);
      const processedFaces: IMediaFace[] = [];

      for (const face of detectedFacesRaw) {
        const faceData: IMediaFace = {
          boundingBox: face.boundingBox,
        };

        if (face.matchedUserId) {
          faceData.matchedUserId = face.matchedUserId as any;
          faceData.faceMatchScore = face.faceMatchScore;
          faceData.matchedAt = new Date();

          // Trigger real-time Socket.IO notification and save DB notification for matched user
          const notificationMessage = `You were spotted in a photo uploaded to event "${event.title}"!`;
          
          const newNotif = await Notification.create({
            recipientId: face.matchedUserId,
            senderId: req.user._id,
            type: 'tag',
            message: notificationMessage,
            eventId: event._id,
          });

          sendNotificationToUser(face.matchedUserId, {
            id: newNotif._id,
            type: 'tag',
            message: notificationMessage,
            eventId: event._id,
            createdAt: newNotif.createdAt,
            isRead: false,
          });
        }

        processedFaces.push(faceData);
      }

      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';

      // 5. Save media records
      const media = await Media.create({
        eventId,
        albumId: albumId || undefined,
        uploaderId: req.user._id,
        fileUrl: secureUrl,
        secureUrl,
        thumbnailUrl,
        publicId,
        fileKey: publicId,
        fileType: mediaType,
        resourceType,
        visibility,
        size: file.size,
        mimeType: file.mimetype,
        tags,
        detectedFaces: processedFaces,
        duplicateHash,
        originalFilename: file.originalname,
      });

      uploadResults.push(media);
    }

    res.status(201).json({
      status: 'success',
      message: `Media uploaded successfully. Processed: ${uploadResults.length}, Skipped Duplicates: ${duplicateSkips.length}`,
      data: {
        media: uploadResults,
        duplicatesSkipped: duplicateSkips,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Optimized cursor-based pagination query
export const getMedia = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;
    const cursor = req.query.cursor as string; // standard _id cursor for pagination
    const { albumId, tag, search } = req.query;

    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Event not found.', 404));
    }

    const viewer = await getAuthorizedViewer(req);
    const isAuthorizedViewer = viewer && ['Admin', 'Photographer', 'ClubMember'].includes(viewer.role);

    const filterQuery: any = { eventId };

    if (event.visibility === 'public' && !isAuthorizedViewer) {
      filterQuery.visibility = 'public';
    }

    if (albumId) {
      filterQuery.albumId = albumId;
    }

    if (tag) {
      filterQuery['tags.label'] = tag;
    }

    if (search) {
      filterQuery.$or = [
        { originalFilename: { $regex: search, $options: 'i' } },
        { 'tags.label': { $regex: search, $options: 'i' } },
      ];
    }

    // Cursor-based filter application
    if (cursor) {
      filterQuery._id = { $lt: cursor };
    }

    // Fetch and sort by latest ID descending
    const mediaItems = await Media.find(filterQuery)
      .sort({ _id: -1 })
      .limit(limit + 1) // Fetch 1 extra item to check if there is a next page
      .populate('uploaderId', 'name email role')
      .populate('taggedUsers.userId', 'name email')
      .populate('taggedUsers.taggedBy', 'name email');

    const hasNextPage = mediaItems.length > limit;
    const paginatedItems = hasNextPage ? mediaItems.slice(0, limit) : mediaItems;
    
    // Set nextCursor to the ID of the last item in the page
    const nextCursor = paginatedItems.length > 0 ? paginatedItems[paginatedItems.length - 1]._id : null;

    res.status(200).json({
      status: 'success',
      results: paginatedItems.length,
      nextCursor: hasNextPage ? nextCursor : null,
      data: { media: paginatedItems },
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaHighlights = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const viewer = await getAuthorizedViewer(req);
    const allowedVisibility = viewer && ['Admin', 'Photographer', 'ClubMember'].includes(viewer.role)
      ? ['public', 'private']
      : ['public'];

    const highlights = await Media.aggregate([
      {
        $match: {
          albumId: { $exists: true, $ne: null },
          visibility: { $in: allowedVisibility },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $match: {
          'event.visibility': { $in: allowedVisibility },
        },
      },
      { $sample: { size: 6 } },
      {
        $lookup: {
          from: 'albums',
          localField: 'albumId',
          foreignField: '_id',
          as: 'album',
        },
      },
      {
        $unwind: { path: '$album', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          fileUrl: 1,
          originalFilename: 1,
          visibility: 1,
          eventId: 1,
          albumId: 1,
          eventTitle: '$event.title',
          albumTitle: '$album.title',
          coverImage: '$fileUrl',
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: highlights.length,
      data: { highlights },
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaTags = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mediaId } = req.params;
    const media = await Media.findById(mediaId)
      .populate('taggedUsers.userId', 'name email')
      .populate('taggedUsers.taggedBy', 'name email');

    if (!media) {
      return next(new AppError('Media item not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      results: media.taggedUsers.length,
      data: { taggedUsers: media.taggedUsers },
    });
  } catch (error) {
    next(error);
  }
};

export const addMediaTag = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));
    const { mediaId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return next(new AppError('A user ID is required to tag.', 400));
    }

    const media = await Media.findById(mediaId);
    if (!media) return next(new AppError('Media item not found.', 404));

    const existingTag = media.taggedUsers.find((tag) => tag.userId.toString() === userId);
    if (existingTag) {
      return next(new AppError('User is already tagged on this media item.', 400));
    }

    const taggedUser = await User.findById(userId);
    if (!taggedUser) return next(new AppError('User to tag not found.', 404));

    media.taggedUsers.push({
      userId: taggedUser._id,
      taggedBy: req.user._id,
      taggedAt: new Date(),
    });

    await media.save();

    const updatedMedia = await Media.findById(mediaId)
      .populate('uploaderId', 'name email role')
      .populate('taggedUsers.userId', 'name email')
      .populate('taggedUsers.taggedBy', 'name email');

    if (updatedMedia) {
      const notificationMessage = `${req.user.name} tagged you in a photo.`;
      const newNotif = await Notification.create({
        recipientId: taggedUser._id,
        senderId: req.user._id,
        type: 'tag',
        message: notificationMessage,
        mediaId: media._id,
        eventId: media.eventId,
      });

      sendNotificationToUser(taggedUser._id.toString(), {
        id: newNotif._id,
        type: 'tag',
        message: notificationMessage,
        mediaId: media._id,
        createdAt: newNotif.createdAt,
        isRead: false,
      });

      broadcastToEvent(media.eventId.toString(), 'media_tagged', {
        mediaId: media._id,
        taggedUsers: updatedMedia.taggedUsers,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User tagged successfully.',
      data: { media: updatedMedia },
    });
  } catch (error) {
    next(error);
  }
};

export const removeMediaTag = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));
    const { mediaId, userId } = req.params;

    const media = await Media.findById(mediaId).populate('taggedUsers.userId', 'name email');
    if (!media) return next(new AppError('Media item not found.', 404));

    const tagIndex = media.taggedUsers.findIndex((tag) => tag.userId.toString() === userId);
    if (tagIndex === -1) {
      return next(new AppError('Tagged user not found on this media item.', 404));
    }

    const taggedEntry = media.taggedUsers[tagIndex];
    const isUploader = media.uploaderId.toString() === req.user._id.toString();
    const isTagger = taggedEntry.taggedBy.toString() === req.user._id.toString();
    const isTaggedUser = taggedEntry.userId.toString() === req.user._id.toString();

    if (!isUploader && !isTagger && !isTaggedUser) {
      return next(new AppError('You are not authorized to remove this tag.', 403));
    }

    media.taggedUsers.splice(tagIndex, 1);
    await media.save();

    const updatedMedia = await Media.findById(mediaId)
      .populate('uploaderId', 'name email role')
      .populate('taggedUsers.userId', 'name email')
      .populate('taggedUsers.taggedBy', 'name email');

    broadcastToEvent(media.eventId.toString(), 'media_untagged', {
      mediaId: media._id,
      taggedUsers: updatedMedia?.taggedUsers || [],
    });

    res.status(200).json({
      status: 'success',
      message: 'Tag removed successfully.',
      data: { media: updatedMedia },
    });
  } catch (error) {
    next(error);
  }
};

// Interactive Features: Likes, Comments, Favorites
export const toggleLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));
    const { mediaId } = req.params;

    const media = await Media.findById(mediaId);
    if (!media) return next(new AppError('No media found with that ID.', 404));

    const existingLike = await Like.findOne({ mediaId, userId: req.user._id });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      media.likesCount = Math.max(0, media.likesCount - 1);
      await media.save();

      // Realtime live update broadcast
      broadcastToEvent(media.eventId.toString(), 'media_unlike', { mediaId, likesCount: media.likesCount });

      return res.status(200).json({
        status: 'success',
        liked: false,
        likesCount: media.likesCount,
      });
    }

    // Like
    await Like.create({ mediaId, userId: req.user._id });
    media.likesCount += 1;
    await media.save();

    // Broadcast likes count update
    broadcastToEvent(media.eventId.toString(), 'media_like', { mediaId, likesCount: media.likesCount });

    // Send push notification to uploader (if different user)
    if (media.uploaderId.toString() !== req.user._id.toString()) {
      const notifMsg = `${req.user.name} liked your photo!`;
      const newNotif = await Notification.create({
        recipientId: media.uploaderId,
        senderId: req.user._id,
        type: 'like',
        message: notifMsg,
        mediaId: media._id,
      });

      sendNotificationToUser(media.uploaderId.toString(), {
        id: newNotif._id,
        type: 'like',
        message: notifMsg,
        mediaId: media._id,
        createdAt: newNotif.createdAt,
        isRead: false,
      });
    }

    res.status(200).json({
      status: 'success',
      liked: true,
      likesCount: media.likesCount,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return next(new AppError('Authentication required.', 401));
    const { mediaId } = req.params;
    const { text } = req.body;

    const media = await Media.findById(mediaId);
    if (!media) return next(new AppError('No media found with that ID.', 404));

    const comment = await Comment.create({
      mediaId,
      userId: req.user._id,
      text,
    });

    // Populate user profile
    await comment.populate('userId', 'name email role referenceSelfieUrl');

    media.commentsCount += 1;
    await media.save();

    // Broadcast live comments updates
    broadcastToEvent(media.eventId.toString(), 'media_comment', {
      mediaId,
      commentsCount: media.commentsCount,
      comment,
    });

    // Send push notification to uploader
    if (media.uploaderId.toString() !== req.user._id.toString()) {
      const notifMsg = `${req.user.name} commented: "${text.substring(0, 30)}..."`;
      const newNotif = await Notification.create({
        recipientId: media.uploaderId,
        senderId: req.user._id,
        type: 'comment',
        message: notifMsg,
        mediaId: media._id,
      });

      sendNotificationToUser(media.uploaderId.toString(), {
        id: newNotif._id,
        type: 'comment',
        message: notifMsg,
        mediaId: media._id,
        createdAt: newNotif.createdAt,
        isRead: false,
      });
    }

    res.status(201).json({
      status: 'success',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mediaId } = req.params;
    const comments = await Comment.find({ mediaId })
      .sort({ createdAt: 1 })
      .populate('userId', 'name email role referenceSelfieUrl');

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

// Dynamic Watermark Downloader API
export const downloadMedia = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mediaId } = req.params;

    // Fetch media details populated with associated event
    const media = await Media.findById(mediaId).populate('eventId');
    if (!media) {
      return next(new AppError('No media found with that ID.', 404));
    }

    const event = media.eventId as any;

    const viewer = await getAuthorizedViewer(req);
    const hasPrivateAccess = viewer && ['Admin', 'Photographer', 'ClubMember'].includes(viewer.role);

    if (event.visibility === 'private' && !hasPrivateAccess) {
      return next(new AppError('This event is private. Please log in with a club member account.', 403));
    }

    if (media.visibility === 'private' && !hasPrivateAccess) {
      return next(new AppError('This media is private. Please log in with a club member account.', 403));
    }

    // 1. Read original media buffer
    let fileBuffer: Buffer;
    
    if (media.fileUrl.startsWith('http://localhost')) {
      // Local fallback mode
      const localFilePath = path.join(__dirname, '../../public/uploads', path.basename(media.fileKey));
      
      if (!fs.existsSync(localFilePath)) {
        return next(new AppError('File was deleted or not found on local storage.', 404));
      }
      fileBuffer = fs.readFileSync(localFilePath);
    } else {
      // AWS S3 Production Mode (Dynamic Fetching via S3 link)
      // Since downloading streams require async networks, we use standard native fetch
      const response = await fetch(media.fileUrl);
      if (!response.ok) {
        return next(new AppError('Could not retrieve image source from cloud repository.', 404));
      }
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    }

    // 2. Apply Dynamic Watermark Layer if it's an image
    // For video streams, we send raw file, watermarking is for images.
    let outputBuffer = fileBuffer;
    if (media.fileType === 'image') {
      const userRole = req.user?.role || 'Viewer';
      
      outputBuffer = await applyWatermark(fileBuffer, {
        clubName: 'EventSphere Club', // Customizable default
        eventName: event.title,
        userRole: userRole,
      });
    }

    // 3. Send Stream back to client
    res.setHeader('Content-Type', media.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="watermarked_${media.originalFilename}"`
    );
    res.send(outputBuffer);
  } catch (error) {
    next(error);
  }
};
