import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export interface SpottedMedia {
  _id: string;
  fileUrl: string;
  fileType: 'image';
  originalFilename: string;
  likesCount: number;
  commentsCount: number;
  detectedFaces: {
    matchedUserId: string;
    faceMatchScore: number;
  }[];
  eventId: {
    _id: string;
    title: string;
    date: string;
  };
  createdAt: string;
}

export const useSpottedPhotos = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['spotted-photos', user?.id],
    queryFn: async (): Promise<SpottedMedia[]> => {
      const { data } = await api.get('/ai/spotted');
      return data.data.media;
    },
    enabled: !!user?.referenceSelfieUrl,
  });
};
