import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '@/services/api-client';
import toast from 'react-hot-toast';
import { IngredientFormValues, ingredientSchema } from '@/components/admin';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/services/api-response';
import { Ingredient } from '@/lib/generated/prisma';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { deleteImageFile } from '@/app/actions';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE, queryKeys } from '@/lib';

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

/**
 * Hook to manage image upload and preview
 */
export function useImageUpload(
  ingredient: Ingredient | null | undefined,
  open: boolean,
  form: UseFormReturn<IngredientFormValues>
) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutateAsync: uploadImage } = useUploadImage();

  useEffect(() => {
    if (ingredient) {
      setPreviewUrl(ingredient.imageUrl);
      setNewImageUrl(null);
    } else {
      setPreviewUrl('');
      setNewImageUrl(null);
    }
    setIsSubmitted(false);
  }, [ingredient, open]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Неверный формат файла. Разрешены только JPG, PNG и WebP';
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return 'Размер файла превышает 5MB';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      form.setError('imageUrl', {
        type: 'manual',
        message: error,
      });
      return;
    }

    form.clearErrors('imageUrl');

    // Delete previous new image if exists
    if (newImageUrl) {
      await deleteImageFile(newImageUrl);
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const imageUrl = result?.imageUrl;

      if (!imageUrl) {
        throw new Error('No imageUrl in response');
      }

      form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
      setPreviewUrl(result.imageUrl);
      setNewImageUrl(result.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Не удалось загрузить изображение');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    // Delete new image if it was uploaded
    if (newImageUrl) {
      await deleteImageFile(newImageUrl);
      setNewImageUrl(null);
    }
    form.setValue('imageUrl', '', { shouldValidate: true });
    setPreviewUrl('');
  };

  const cleanupOrphanedImage = async () => {
    if (newImageUrl && !isSubmitted) {
      try {
        await deleteImageFile(newImageUrl);
      } catch (error) {
        console.error('Failed to delete orphaned image:', error);
      }
    }
  };

  const markAsSubmitted = () => {
    setIsSubmitted(true);
  };

  const resetImageState = () => {
    setPreviewUrl('');
    setNewImageUrl(null);
  };

  return {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  };
}
