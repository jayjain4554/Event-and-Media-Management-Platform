"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMedia = exports.getComments = exports.addComment = exports.toggleLike = exports.removeMediaTag = exports.addMediaTag = exports.getMediaTags = exports.getMediaHighlights = exports.getMedia = exports.uploadMedia = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mediaModel_1 = require("./mediaModel");
const commentModel_1 = require("./commentModel");
const likeModel_1 = require("./likeModel");
const eventModel_1 = require("../event/eventModel");
const userModel_1 = require("../user/userModel");
const notificationModel_1 = require("../notification/notificationModel");
const errors_1 = require("../../shared/errors");
const cloudinaryService_1 = require("../../services/cloudinaryService");
const rekognitionService_1 = require("../../services/rekognitionService");
const watermarkService_1 = require("../../services/watermarkService");
const socketService_1 = require("../../services/socketService");
const env_1 = require("../../config/env");
// Hash helper for duplicate detection
const computeBufferHash = (buffer) => {
    return crypto_1.default.createHash('md5').update(buffer).digest('hex');
};
const getAuthorizedViewer = async (req) => {
    if (req.user)
        return req.user;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return null;
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        return await userModel_1.User.findById(decoded.id);
    }
    catch {
        return null;
    }
};
const uploadMedia = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new errors_1.AppError('Authentication required.', 401));
        }
        const { eventId, albumId } = req.body;
        const visibility = req.body.visibility === 'private' ? 'private' : 'public';
        if (!eventId) {
            return next(new errors_1.AppError('Event ID is required.', 400));
        }
        const event = await eventModel_1.Event.findById(eventId);
        if (!event) {
            return next(new errors_1.AppError('Associated event not found.', 404));
        }
        // Capture file arrays (supports single or bulk array fields)
        const files = req.files || (req.file ? [req.file] : []);
        if (files.length === 0) {
            return next(new errors_1.AppError('No media files provided for upload.', 400));
        }
        const uploadResults = [];
        const duplicateSkips = [];
        // Process uploaded files
        for (const file of files) {
            const duplicateHash = computeBufferHash(file.buffer);
            // 1. Duplicate Image Detection
            const existingMedia = await mediaModel_1.Media.findOne({ eventId, duplicateHash });
            if (existingMedia) {
                duplicateSkips.push(file.originalname);
                continue; // Skip uploading duplicate files to S3/DB
            }
            // 2. Upload original file to Cloudinary
            const uploadResult = await (0, cloudinaryService_1.uploadCloudinaryFile)(file.buffer, file.originalname, file.mimetype);
            const { publicId, secureUrl, thumbnailUrl, resourceType } = uploadResult;
            // 3. AI Features: Smart Image Tagging
            const tags = await (0, rekognitionService_1.detectLabels)(file.buffer, file.originalname);
            // 4. AI Features: Facial Recognition & Personalized discovery
            // Run real AWS Rekognition collection matching flow (falls back to mock dynamically)
            const detectedFacesRaw = await (0, rekognitionService_1.matchFacesInPhoto)(file.buffer);
            const processedFaces = [];
            for (const face of detectedFacesRaw) {
                const faceData = {
                    boundingBox: face.boundingBox,
                };
                if (face.matchedUserId) {
                    faceData.matchedUserId = face.matchedUserId;
                    faceData.faceMatchScore = face.faceMatchScore;
                    faceData.matchedAt = new Date();
                    // Trigger real-time Socket.IO notification and save DB notification for matched user
                    const notificationMessage = `You were spotted in a photo uploaded to event "${event.title}"!`;
                    const newNotif = await notificationModel_1.Notification.create({
                        recipientId: face.matchedUserId,
                        senderId: req.user._id,
                        type: 'tag',
                        message: notificationMessage,
                        eventId: event._id,
                    });
                    (0, socketService_1.sendNotificationToUser)(face.matchedUserId, {
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
            const media = await mediaModel_1.Media.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.uploadMedia = uploadMedia;
// Optimized cursor-based pagination query
const getMedia = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const limit = parseInt(req.query.limit) || 12;
        const cursor = req.query.cursor; // standard _id cursor for pagination
        const { albumId, tag, search } = req.query;
        const event = await eventModel_1.Event.findById(eventId);
        if (!event) {
            return next(new errors_1.AppError('Event not found.', 404));
        }
        const viewer = await getAuthorizedViewer(req);
        const isAuthorizedViewer = viewer && ['Admin', 'Photographer', 'ClubMember'].includes(viewer.role);
        const filterQuery = { eventId };
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
        const mediaItems = await mediaModel_1.Media.find(filterQuery)
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMedia = getMedia;
const getMediaHighlights = async (req, res, next) => {
    try {
        const viewer = await getAuthorizedViewer(req);
        const allowedVisibility = viewer && ['Admin', 'Photographer', 'ClubMember'].includes(viewer.role)
            ? ['public', 'private']
            : ['public'];
        const highlights = await mediaModel_1.Media.aggregate([
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMediaHighlights = getMediaHighlights;
const getMediaTags = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        const media = await mediaModel_1.Media.findById(mediaId)
            .populate('taggedUsers.userId', 'name email')
            .populate('taggedUsers.taggedBy', 'name email');
        if (!media) {
            return next(new errors_1.AppError('Media item not found.', 404));
        }
        res.status(200).json({
            status: 'success',
            results: media.taggedUsers.length,
            data: { taggedUsers: media.taggedUsers },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMediaTags = getMediaTags;
const addMediaTag = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const { mediaId } = req.params;
        const { userId } = req.body;
        if (!userId) {
            return next(new errors_1.AppError('A user ID is required to tag.', 400));
        }
        const media = await mediaModel_1.Media.findById(mediaId);
        if (!media)
            return next(new errors_1.AppError('Media item not found.', 404));
        const existingTag = media.taggedUsers.find((tag) => tag.userId.toString() === userId);
        if (existingTag) {
            return next(new errors_1.AppError('User is already tagged on this media item.', 400));
        }
        const taggedUser = await userModel_1.User.findById(userId);
        if (!taggedUser)
            return next(new errors_1.AppError('User to tag not found.', 404));
        media.taggedUsers.push({
            userId: taggedUser._id,
            taggedBy: req.user._id,
            taggedAt: new Date(),
        });
        await media.save();
        const updatedMedia = await mediaModel_1.Media.findById(mediaId)
            .populate('uploaderId', 'name email role')
            .populate('taggedUsers.userId', 'name email')
            .populate('taggedUsers.taggedBy', 'name email');
        if (updatedMedia) {
            const notificationMessage = `${req.user.name} tagged you in a photo.`;
            const newNotif = await notificationModel_1.Notification.create({
                recipientId: taggedUser._id,
                senderId: req.user._id,
                type: 'tag',
                message: notificationMessage,
                mediaId: media._id,
                eventId: media.eventId,
            });
            (0, socketService_1.sendNotificationToUser)(taggedUser._id.toString(), {
                id: newNotif._id,
                type: 'tag',
                message: notificationMessage,
                mediaId: media._id,
                createdAt: newNotif.createdAt,
                isRead: false,
            });
            (0, socketService_1.broadcastToEvent)(media.eventId.toString(), 'media_tagged', {
                mediaId: media._id,
                taggedUsers: updatedMedia.taggedUsers,
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'User tagged successfully.',
            data: { media: updatedMedia },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addMediaTag = addMediaTag;
const removeMediaTag = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const { mediaId, userId } = req.params;
        const media = await mediaModel_1.Media.findById(mediaId).populate('taggedUsers.userId', 'name email');
        if (!media)
            return next(new errors_1.AppError('Media item not found.', 404));
        const tagIndex = media.taggedUsers.findIndex((tag) => tag.userId.toString() === userId);
        if (tagIndex === -1) {
            return next(new errors_1.AppError('Tagged user not found on this media item.', 404));
        }
        const taggedEntry = media.taggedUsers[tagIndex];
        const isUploader = media.uploaderId.toString() === req.user._id.toString();
        const isTagger = taggedEntry.taggedBy.toString() === req.user._id.toString();
        const isTaggedUser = taggedEntry.userId.toString() === req.user._id.toString();
        if (!isUploader && !isTagger && !isTaggedUser) {
            return next(new errors_1.AppError('You are not authorized to remove this tag.', 403));
        }
        media.taggedUsers.splice(tagIndex, 1);
        await media.save();
        const updatedMedia = await mediaModel_1.Media.findById(mediaId)
            .populate('uploaderId', 'name email role')
            .populate('taggedUsers.userId', 'name email')
            .populate('taggedUsers.taggedBy', 'name email');
        (0, socketService_1.broadcastToEvent)(media.eventId.toString(), 'media_untagged', {
            mediaId: media._id,
            taggedUsers: updatedMedia?.taggedUsers || [],
        });
        res.status(200).json({
            status: 'success',
            message: 'Tag removed successfully.',
            data: { media: updatedMedia },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeMediaTag = removeMediaTag;
// Interactive Features: Likes, Comments, Favorites
const toggleLike = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const { mediaId } = req.params;
        const media = await mediaModel_1.Media.findById(mediaId);
        if (!media)
            return next(new errors_1.AppError('No media found with that ID.', 404));
        const existingLike = await likeModel_1.Like.findOne({ mediaId, userId: req.user._id });
        if (existingLike) {
            // Unlike
            await likeModel_1.Like.deleteOne({ _id: existingLike._id });
            media.likesCount = Math.max(0, media.likesCount - 1);
            await media.save();
            // Realtime live update broadcast
            (0, socketService_1.broadcastToEvent)(media.eventId.toString(), 'media_unlike', { mediaId, likesCount: media.likesCount });
            return res.status(200).json({
                status: 'success',
                liked: false,
                likesCount: media.likesCount,
            });
        }
        // Like
        await likeModel_1.Like.create({ mediaId, userId: req.user._id });
        media.likesCount += 1;
        await media.save();
        // Broadcast likes count update
        (0, socketService_1.broadcastToEvent)(media.eventId.toString(), 'media_like', { mediaId, likesCount: media.likesCount });
        // Send push notification to uploader (if different user)
        if (media.uploaderId.toString() !== req.user._id.toString()) {
            const notifMsg = `${req.user.name} liked your photo!`;
            const newNotif = await notificationModel_1.Notification.create({
                recipientId: media.uploaderId,
                senderId: req.user._id,
                type: 'like',
                message: notifMsg,
                mediaId: media._id,
            });
            (0, socketService_1.sendNotificationToUser)(media.uploaderId.toString(), {
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
    }
    catch (error) {
        next(error);
    }
};
exports.toggleLike = toggleLike;
const addComment = async (req, res, next) => {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Authentication required.', 401));
        const { mediaId } = req.params;
        const { text } = req.body;
        const media = await mediaModel_1.Media.findById(mediaId);
        if (!media)
            return next(new errors_1.AppError('No media found with that ID.', 404));
        const comment = await commentModel_1.Comment.create({
            mediaId,
            userId: req.user._id,
            text,
        });
        // Populate user profile
        await comment.populate('userId', 'name email role referenceSelfieUrl');
        media.commentsCount += 1;
        await media.save();
        // Broadcast live comments updates
        (0, socketService_1.broadcastToEvent)(media.eventId.toString(), 'media_comment', {
            mediaId,
            commentsCount: media.commentsCount,
            comment,
        });
        // Send push notification to uploader
        if (media.uploaderId.toString() !== req.user._id.toString()) {
            const notifMsg = `${req.user.name} commented: "${text.substring(0, 30)}..."`;
            const newNotif = await notificationModel_1.Notification.create({
                recipientId: media.uploaderId,
                senderId: req.user._id,
                type: 'comment',
                message: notifMsg,
                mediaId: media._id,
            });
            (0, socketService_1.sendNotificationToUser)(media.uploaderId.toString(), {
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
    }
    catch (error) {
        next(error);
    }
};
exports.addComment = addComment;
const getComments = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        const comments = await commentModel_1.Comment.find({ mediaId })
            .sort({ createdAt: 1 })
            .populate('userId', 'name email role referenceSelfieUrl');
        res.status(200).json({
            status: 'success',
            results: comments.length,
            data: { comments },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getComments = getComments;
// Dynamic Watermark Downloader API
const downloadMedia = async (req, res, next) => {
    try {
        const { mediaId } = req.params;
        // Fetch media details populated with associated event
        const media = await mediaModel_1.Media.findById(mediaId).populate('eventId');
        if (!media) {
            return next(new errors_1.AppError('No media found with that ID.', 404));
        }
        const event = media.eventId;
        const viewer = await getAuthorizedViewer(req);
        const hasPrivateAccess = viewer && ['Admin', 'Photographer', 'ClubMember'].includes(viewer.role);
        if (event.visibility === 'private' && !hasPrivateAccess) {
            return next(new errors_1.AppError('This event is private. Please log in with a club member account.', 403));
        }
        if (media.visibility === 'private' && !hasPrivateAccess) {
            return next(new errors_1.AppError('This media is private. Please log in with a club member account.', 403));
        }
        // 1. Read original media buffer
        let fileBuffer;
        if (media.fileUrl.startsWith('http://localhost')) {
            // Local fallback mode
            const localFilePath = path_1.default.join(__dirname, '../../public/uploads', path_1.default.basename(media.fileKey));
            if (!fs_1.default.existsSync(localFilePath)) {
                return next(new errors_1.AppError('File was deleted or not found on local storage.', 404));
            }
            fileBuffer = fs_1.default.readFileSync(localFilePath);
        }
        else {
            // AWS S3 Production Mode (Dynamic Fetching via S3 link)
            // Since downloading streams require async networks, we use standard native fetch
            const response = await fetch(media.fileUrl);
            if (!response.ok) {
                return next(new errors_1.AppError('Could not retrieve image source from cloud repository.', 404));
            }
            const arrayBuffer = await response.arrayBuffer();
            fileBuffer = Buffer.from(arrayBuffer);
        }
        // 2. Apply Dynamic Watermark Layer if it's an image
        // For video streams, we send raw file, watermarking is for images.
        let outputBuffer = fileBuffer;
        if (media.fileType === 'image') {
            const userRole = req.user?.role || 'Viewer';
            outputBuffer = await (0, watermarkService_1.applyWatermark)(fileBuffer, {
                clubName: 'EventSphere Club', // Customizable default
                eventName: event.title,
                userRole: userRole,
            });
        }
        // 3. Send Stream back to client
        res.setHeader('Content-Type', media.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="watermarked_${media.originalFilename}"`);
        res.send(outputBuffer);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadMedia = downloadMedia;
