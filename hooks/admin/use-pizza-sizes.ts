import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PizzaSize } from '@/lib/generated/prisma';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { ApiResponse } from '@/services/api-response';
import { PizzaSizeFormValues, pizzaSizeSchema } from '@/components/admin';

export function useGetPizzaSizes() {
  return useQuery({
    queryKey: queryKeys['pizza-sizes'],
    queryFn: Api.admin.getPizzaSizes,
  });
}

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

/**
 * Hook to manage pizza size form state and submission
 */
export function usePizzaSizeForm(
  pizzaSize: PizzaSize | null | undefined,
  open: boolean,
  onClose: () => void
) {
  const isEditing = !!pizzaSize;

  const { mutate: createPizzaSize, isPending: isCreating } =
    useCreatePizzaSize();
  const { mutate: updatePizzaSize, isPending: isUpdating } =
    useUpdatePizzaSize();
  const isPending = isCreating || isUpdating;

  const form = useForm<PizzaSizeFormValues>({
    resolver: zodResolver(pizzaSizeSchema),
    defaultValues: {
      size: 0,
      label: '',
    },
  });

  useEffect(() => {
    if (pizzaSize) {
      form.reset({
        size: pizzaSize.size,
        label: pizzaSize.label,
      });
    } else {
      form.reset({
        size: 0,
        label: '',
      });
    }
  }, [pizzaSize, form, open]);

  const onSubmit = (data: PizzaSizeFormValues) => {
    if (isEditing) {
      updatePizzaSize(
        { id: pizzaSize.id, dto: data },
        {
          onSuccess: () => {
            onClose();
            form.reset();
          },
        }
      );
    } else {
      createPizzaSize(data, {
        onSuccess: () => {
          onClose();
          form.reset();
        },
      });
    }
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit,
  };
}
