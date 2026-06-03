import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface NotificationItem {
  _id: string;
  type: 'like' | 'comment' | 'tag' | 'event';
  message: string;
  isRead: boolean;
  senderId?: {
    name: string;
  };
  eventId?: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<NotificationsResponse> => {
      const { data } = await api.get('/notifications');
      return {
        notifications: data.data.notifications,
        unreadCount: data.unreadCount || 0,
      };
    },
  });
};

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch('/notifications/read');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
