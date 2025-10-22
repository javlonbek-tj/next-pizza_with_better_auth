import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { ApiResponse } from '@/services/api-response';
import { PizzaTypeFormValues } from '@/components/admin';

export function useGetPizzaTypes() {
  return useQuery({
    queryKey: queryKeys['pizza-sizes'],
    queryFn: Api.admin.getPizzaTypes,
  });
}

// ✅ Create Pizza Type
export function useCreatePizzaType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: PizzaTypeFormValues) => Api.admin.createPizzaType(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys['pizza-types'] });
      toast.success('Тип пиццы успешно создан');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Тип пиццы с таким именем уже существует'
        );
      }
      toast.error('Не удалось создать тип пиццы');
    },
  });
}

// ✅ Update Pizza Type
export function useUpdatePizzaType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; dto: PizzaTypeFormValues }) =>
      await Api.admin.updatePizzaType(data.id, data.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys['pizza-types'] });
      toast.success('Тип пиццы успешно изменён');
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      if (error.response?.status === 409) {
        return toast.error(
          error.response.data.message ||
            'Тип пиццы с таким именем уже существует'
        );
      }
      toast.error('Не удалось изменить тип пиццы');
    },
  });
}

// ✅ Delete Pizza Type
export function useDeletePizzaType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => Api.admin.deletePizzaType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys['pizza-types'] });
      toast.success('Тип пиццы успешно удалён');
    },
    onError: () => {
      toast.error('Не удалось удалить тип пиццы');
    },
  });
}
