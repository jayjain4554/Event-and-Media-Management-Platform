import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { AxiosRequestConfig } from 'axios';

interface UploadMediaVariables {
  formData: FormData;
  onUploadProgress?: AxiosRequestConfig['onUploadProgress'];
}

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData, onUploadProgress }: UploadMediaVariables) => {
      const { data } = await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries if needed, e.g. event media or admin metrics
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });
};
