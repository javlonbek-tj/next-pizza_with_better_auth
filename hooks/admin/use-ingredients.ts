import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '@/services/api-client';
import toast from 'react-hot-toast';
import { IngredientFormValues, ingredientSchema } from '@/components/admin';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/services/api-response';
import { Ingredient } from '@/lib/generated/prisma';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { queryKeys } from '@/lib';

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
          error.response.data.message || 'Не удалось загрузить изображение'
        );
      toast.error('Не удалось загрузить изображение');
    },
  });
}

/**
 * Hook to manage ingredient form state and submission
 */
export function useIngredientForm(
  ingredient: Ingredient | null | undefined,
  open: boolean,
  onClose: () => void
) {
  const isEditing = !!ingredient;

  const { mutate: createIngredient, isPending: isCreating } =
    useCreateIngredient();
  const { mutate: updateIngredient, isPending: isUpdating } =
    useUpdateIngredient();
  const isPending = isCreating || isUpdating;

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      price: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({
        name: ingredient.name,
        price: ingredient.price,
        imageUrl: ingredient.imageUrl,
      });
    } else {
      form.reset({
        name: '',
        price: 0,
        imageUrl: '',
      });
    }
  }, [ingredient, form, open]);

  const onSubmit = (data: IngredientFormValues, onSuccess: () => void) => {
    if (isEditing) {
      updateIngredient(
        { id: ingredient.id, dto: data },
        {
          onSuccess: () => {
            onSuccess();
            onClose();
            form.reset();
          },
          onError: () => {
            toast.error('Не удалось обновить ингредиент');
          },
        }
      );
    } else {
      createIngredient(data, {
        onSuccess: () => {
          onSuccess();
          onClose();
          form.reset();
        },
        onError: () => {
          toast.error('Не удалось создать ингредиент');
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
