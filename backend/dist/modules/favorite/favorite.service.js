"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteService = exports.FavoriteService = void 0;
const favoriteModel_1 = require("../media/favoriteModel");
const mediaModel_1 = require("../media/mediaModel");
const errors_1 = require("../../shared/errors");
class FavoriteService {
    async toggleFavorite(mediaId, userId) {
        // 1. Check if media exists
        const media = await mediaModel_1.Media.findById(mediaId);
        if (!media) {
            throw new errors_1.AppError('No media found with that ID.', 404);
        }
        // 2. Check if already favorited
        const existingFavorite = await favoriteModel_1.Favorite.findOne({ mediaId, userId });
        if (existingFavorite) {
            // Remove favorite
            await favoriteModel_1.Favorite.deleteOne({ _id: existingFavorite._id });
            return { favorited: false };
        }
        // Add favorite (prevent duplicate)
        await favoriteModel_1.Favorite.create({ mediaId, userId });
        return { favorited: true };
    }
    async getFavorites(userId) {
        const favorites = await favoriteModel_1.Favorite.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
            path: 'mediaId',
            populate: {
                path: 'eventId',
                select: 'title date coverImage location category',
            },
        });
        // Filter out and clean records where media was deleted
        const validMedia = favorites
            .filter((fav) => fav.mediaId !== null && fav.mediaId !== undefined)
            .map((fav) => fav.mediaId);
        return validMedia;
    }
}
exports.FavoriteService = FavoriteService;
exports.favoriteService = new FavoriteService();
