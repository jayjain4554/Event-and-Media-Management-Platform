import { Favorite } from '../media/favoriteModel';
import { Media } from '../media/mediaModel';
import { AppError } from '../../shared/errors';

export class FavoriteService {
  public async toggleFavorite(mediaId: string, userId: string): Promise<{ favorited: boolean }> {
    // 1. Check if media exists
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new AppError('No media found with that ID.', 404);
    }

    // 2. Check if already favorited
    const existingFavorite = await Favorite.findOne({ mediaId, userId });

    if (existingFavorite) {
      // Remove favorite
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return { favorited: false };
    }

    // Add favorite (prevent duplicate)
    await Favorite.create({ mediaId, userId });
    return { favorited: true };
  }

  public async getFavorites(userId: string) {
    const favorites = await Favorite.find({ userId })
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

export const favoriteService = new FavoriteService();
