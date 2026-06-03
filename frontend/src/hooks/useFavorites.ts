import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface FavoriteMedia {
  _id: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  mimeType: string;
  originalFilename: string;
  likesCount: number;
  commentsCount: number;
  tags: { label: string; confidence: number }[];
  uploaderId: { name: string; email: string };
  eventId: {
    _id: string;
    title: string;
    date: string;
    coverImage: string;
    location: string;
    category: string;
  };
  createdAt: string;
}

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<FavoriteMedia[]> => {
      const { data } = await api.get('/favorites');
      return data.data.favorites;
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaId: string): Promise<{ favorited: boolean }> => {
      const { data } = await api.post('/favorites/toggle', { mediaId });
      return data.data;
    },
    // Optimistic updates on the favorites list
    onMutate: async (mediaId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previousFavorites = queryClient.getQueryData<FavoriteMedia[]>(['favorites']);

      if (previousFavorites) {
        const isAlreadyFavorited = previousFavorites.some((item) => item._id === mediaId);
        if (isAlreadyFavorited) {
          queryClient.setQueryData(
            ['favorites'],
            previousFavorites.filter((item) => item._id !== mediaId)
          );
        }
      }

      return { previousFavorites };
    },
    onError: (_err, _mediaId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
