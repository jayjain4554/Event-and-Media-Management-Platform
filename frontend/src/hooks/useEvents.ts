import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, CreateEventPayload, UpdateEventPayload } from '../services/eventService';

export const useEvents = (filters: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents(filters),
  });
};

export const useEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventService.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, payload }: { eventId: string; payload: UpdateEventPayload }) =>
      eventService.updateEvent(eventId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

