import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { albumService, CreateAlbumPayload } from '../services/albumService';

export const useAlbums = (eventId: string) => {
  return useQuery({
    queryKey: ['albums', eventId],
    queryFn: () => albumService.getAlbums(eventId),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateAlbum = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAlbumPayload) => albumService.createAlbum(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums', eventId] });
    },
  });
};
