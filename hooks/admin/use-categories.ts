import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormValues, categorySchema } from '@/components/admin';
import { generateSlug, queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { ApiResponse } from '@/services/api-response';
import { Category } from '@/types';

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

export function useCategoryForm(
  category: Category | null | undefined,
  open: boolean,
  onClose: () => void
) {
  const isEditing = !!category;

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const isPending = isCreating || isUpdating;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
      });
    }
  }, [category, form, open]);

  const handleNameChange = (value: string) => {
    form.setValue('name', value);

    // Auto-generate slug only when creating new category
    if (!isEditing) {
      const generatedSlug = generateSlug(value);
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  };

  const handleSlugChange = (value: string) => {
    form.setValue('slug', value);
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (isEditing) {
      updateCategory(
        { id: category.id, dto: data },
        {
          onSuccess: () => {
            onClose();
            form.reset();
          },
        }
      );
    } else {
      createCategory(data, {
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
    handleNameChange,
    handleSlugChange,
    onSubmit,
  };
}
