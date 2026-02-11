import { useMutation } from '@tanstack/react-query';
import { Api } from '@/services/api-client';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/services/api-response';

type UploadFolder = 'ingredients' | 'products';

export function useUploadImage(folder: UploadFolder) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return Api.admin.uploadImage(formData);
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 400)
        return toast.error(
          error.response.data.message || 'Не удалось загрузить изображение',
        );
      toast.error('Не удалось загрузить изображение');
    },
  });
}
