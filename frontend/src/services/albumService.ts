import api from './api';

export interface Album {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  mediaCount?: number;
}

export interface CreateAlbumPayload {
  title: string;
  description?: string;
  coverImage?: string;
}

export const albumService = {
  getAlbums: async (eventId: string) => {
    if (!eventId) {
      throw new Error('Event ID is required to load albums.');
    }
    const response = await api.get(`/events/${eventId}/albums`);
    return response.data.data.albums as Album[];
  },

  createAlbum: async (eventId: string, payload: CreateAlbumPayload) => {
    if (!eventId) {
      throw new Error('Event ID is required to create an album.');
    }
    const response = await api.post(`/events/${eventId}/albums`, payload);
    return response.data.data.album as Album;
  },
};
