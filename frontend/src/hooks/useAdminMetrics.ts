import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface AdminMetrics {
  users: {
    total: number;
    admin: number;
    photographer: number;
    member: number;
    viewer: number;
  };
  events: {
    total: number;
    public: number;
    private: number;
  };
  media: {
    total: number;
    images: number;
    videos: number;
  };
  storage: {
    bytes: number;
    formatted: string;
  };
  popularEvents: {
    event: {
      title: string;
      category: string;
    };
    mediaCount: number;
    totalLikes: number;
  }[];
  charts: {
    uploads: { month: string; uploads: number }[];
    users: { month: string; members: number }[];
  };
}

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async (): Promise<AdminMetrics> => {
      const { data } = await api.get('/admin/metrics');
      return data.data.metrics;
    },
  });
};
