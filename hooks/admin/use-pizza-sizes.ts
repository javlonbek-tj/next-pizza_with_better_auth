import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { ApiResponse } from '@/services/api-response';
import { PizzaSizeFormValues } from '@/components/admin';

// ✅ Get all pizza sizes
export function useGetPizzaSizes() {
  return useQuery({
    queryKey: queryKeys['pizza-sizes'],
    queryFn: Api.admin.getPizzaSizes,
  });
}

// ✅ Create a new pizza size
export function useCreatePizzaSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: PizzaSizeFormValues) => Api.admin.createPizzaSize(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys['pizza-sizes'] });
      toast.success('Размер пиццы успешно создан');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Размер пиццы с таким именем уже существует'
        );
      }
      toast.error('Не удалось создать размер пиццы');
    },
  });
}

// ✅ Update existing pizza size
export function useUpdatePizzaSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; dto: PizzaSizeFormValues }) =>
      await Api.admin.updatePizzaSize(data.id, data.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys['pizza-sizes'] });
      toast.success('Размер пиццы успешно изменён');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Размер пиццы с таким именем уже существует'
        );
      }
      toast.error('Не удалось изменить размер пиццы');
    },
  });
}

// ✅ Delete pizza size
export function useDeletePizzaSize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => Api.admin.deletePizzaSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys['pizza-sizes'] });
      toast.success('Размер пиццы успешно удалён');
    },
    onError: () => {
      toast.error('Не удалось удалить размер пиццы');
    },
  });
}
