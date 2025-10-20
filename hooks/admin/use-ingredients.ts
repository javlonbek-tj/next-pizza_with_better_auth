import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '@/services/api-client';
import toast from 'react-hot-toast';
import { IngredientFormValues } from '@/components/admin';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/services/api-response';

const queryKeys = {
  ingredients: ['ingredients'],
};

export function useGetIngredients() {
  return useQuery({
    queryKey: queryKeys.ingredients,
    queryFn: Api.admin.getIngredients,
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: IngredientFormValues) =>
      Api.admin.createIngredient(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients });
      toast.success('Ингредиент успешно создан');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Ингредиент с таким именем уже существует'
        );
      }
      toast.error('Не удалось создать ингредиент');
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; dto: IngredientFormValues }) =>
      await Api.admin.updateIngredient(data.id, data.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients });
      toast.success('Ингредиент успешно изменен');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Ингредиент с таким именем уже существует'
        );
      }
      toast.error('Не удалось изменить ингредиент');
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.admin.deleteIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients });
      toast.success('Ингредиент успешно удален');
    },
    onError: () => {
      toast.error('Не удалось удалить ингредиент');
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return Api.admin.uploadImage(formData);
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 400)
        return toast.error(
          error.response.data.message || 'Не удалось загрузить изображение'
        );
      toast.error('Не удалось загрузить изображение');
    },
  });
}
