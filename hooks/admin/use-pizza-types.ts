import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PizzaType } from '@/lib/generated/prisma';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { ApiResponse } from '@/services/api-response';
import { PizzaTypeFormValues, pizzaTypeSchema } from '@/components/admin';

export function useGetPizzaTypes() {
  return useQuery({
    queryKey: queryKeys['pizza-types'],
    queryFn: Api.admin.getPizzaTypes,
  });
}

export function usePizzaTypes() {
  return useQuery({
    queryKey: queryKeys['pizza-types'],
    queryFn: Api.admin.getPizzaTypes,
  });
}

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

/**
 * Hook to manage pizza type form state and submission
 */
export function usePizzaTypeForm(
  pizzaType: PizzaType | null | undefined,
  open: boolean,
  onClose: () => void
) {
  const isEditing = !!pizzaType;

  const { mutate: createPizzaType, isPending: isCreating } =
    useCreatePizzaType();
  const { mutate: updatePizzaType, isPending: isUpdating } =
    useUpdatePizzaType();
  const isPending = isCreating || isUpdating;

  const form = useForm<PizzaTypeFormValues>({
    resolver: zodResolver(pizzaTypeSchema),
    defaultValues: {
      type: '',
    },
  });

  useEffect(() => {
    if (pizzaType) {
      form.reset({
        type: pizzaType.type,
      });
    } else {
      form.reset({
        type: '',
      });
    }
  }, [pizzaType, form, open]);

  const onSubmit = (data: PizzaTypeFormValues) => {
    if (isEditing) {
      updatePizzaType(
        { id: pizzaType.id, dto: data },
        {
          onSuccess: () => {
            onClose();
            form.reset();
          },
        }
      );
    } else {
      createPizzaType(data, {
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
