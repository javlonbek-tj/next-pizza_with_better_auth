import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { CategoryFormValues } from '@/components/admin';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { ApiResponse } from '@/services/api-response';

export function useGetCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: Api.admin.getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: CategoryFormValues) => Api.admin.createCategory(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success('Категория успешно создана');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Категория с таким именем уже существует'
        );
      }
      toast.error('Не удалось создать категорию');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; dto: CategoryFormValues }) =>
      await Api.admin.updateCategory(data.id, data.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success('Категория успешно изменена');
    },

    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Категория с таким именем уже существует'
        );
      }
      toast.error('Не удалось изменить категорию');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => Api.admin.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success('Категория успешно удалена');
    },
    onError: () => {
      toast.error('Не удалось удалить категорию');
    },
  });
}
