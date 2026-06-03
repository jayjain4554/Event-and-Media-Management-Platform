import api from './api';

export interface CreateEventPayload {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  coverImage: string;
  visibility: 'public' | 'private';
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

export const eventService = {
  getEvents: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    // Transform category 'All' to empty string for API
    const apiParams = { ...params };
    if (apiParams.category === 'All') {
      delete apiParams.category;
    }
    const response = await api.get('/events', { params: apiParams });
    return response.data;
  },

  getEvent: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data.data.event;
  },

  createEvent: async (payload: CreateEventPayload) => {
    const response = await api.post('/events', payload);
    return response.data.data.event;
  },

  updateEvent: async (eventId: string, payload: UpdateEventPayload) => {
    const response = await api.patch(`/events/${eventId}`, payload);
    return response.data.data.event;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  getAlbums: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/albums`);
    return response.data.data.albums;
  },

  createAlbum: async (eventId: string, payload: { title: string; description?: string; coverImage?: string }) => {
    const response = await api.post(`/events/${eventId}/albums`, payload);
    return response.data.data.album;
  },
};
