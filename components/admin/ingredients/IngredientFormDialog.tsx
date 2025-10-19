'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useCreateIngredient,
  useUpdateIngredient,
  useUploadImage,
} from '@/hooks/admin/use-ingredients';
import { Loader2, Upload, X } from 'lucide-react';
import { Ingredient } from '@/lib/generated/prisma';

import Image from 'next/image';
import { IngredientFormValues, ingredientSchema } from '../schemas';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export function IngredientFormDialog({ open, onClose, ingredient }: Props) {
  const isEditing = !!ingredient;
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createIngredient, isPending: isCreating } =
    useCreateIngredient();
  const { mutate: updateIngredient, isPending: isUpdating } =
    useUpdateIngredient();
  const { mutateAsync: uploadImage } = useUploadImage();
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
      setPreviewUrl(ingredient.imageUrl);
    } else {
      form.reset({
        name: '',
        price: 0,
        imageUrl: '',
      });
      setPreviewUrl('');
    }
  }, [ingredient, form, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Неверный формат файла. Разрешены только JPG, PNG и WebP');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла превышает 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
      setPreviewUrl(result.imageUrl);
      toast.success('Изображение загружено');
    } catch (error) {
      toast.error('Не удалось загрузить изображение');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('imageUrl', '', { shouldValidate: true });
    setPreviewUrl('');
  };

  const handleError = (error: any) => {
    const apiError = error?.response?.data;

    if (
      apiError?.validationErrors &&
      Array.isArray(apiError.validationErrors)
    ) {
      apiError.validationErrors.forEach((validationError: any) => {
        const field = validationError.field as keyof IngredientFormValues;
        if (field in form.control._fields) {
          form.setError(field, {
            type: 'server',
            message: validationError.message,
          });
        } else {
          toast.error(validationError.message);
        }
      });
    } else if (apiError?.message) {
      toast.error(apiError.message);
    } else {
      toast.error('Произошла ошибка');
    }
  };

  const onSubmit = (data: IngredientFormValues) => {
    if (isEditing) {
      updateIngredient(
        { id: ingredient.id, dto: data },
        {
          onSuccess: () => {
            onClose();
            form.reset();
            setPreviewUrl('');
          },
          onError: handleError,
        }
      );
    } else {
      createIngredient(data, {
        onSuccess: () => {
          onClose();
          form.reset();
          setPreviewUrl('');
        },
        onError: handleError,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать ингредиент' : 'Создать ингредиент'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {previewUrl ? (
                        <div className="group relative border rounded-lg w-full h-48 overflow-hidden">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="top-2 right-2 absolute bg-red-500 opacity-0 group-hover:opacity-100 p-2 rounded-full text-white transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col justify-center items-center border-2 border-gray-300 hover:border-violet-500 border-dashed rounded-lg w-full h-48 transition-colors cursor-pointer">
                          <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <Upload className="mb-3 w-10 h-10 text-gray-400" />
                            <p className="text-gray-600 text-sm">
                              <span className="font-semibold">
                                Нажмите для загрузки
                              </span>{' '}
                              или перетащите
                            </p>
                            <p className="mt-1 text-gray-500 text-xs">
                              PNG, JPG, WebP (макс. 5MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      )}
                      {isUploading && (
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
                          <span className="ml-2 text-gray-600 text-sm">
                            Загрузка...
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Сыр моцарелла" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена (сум)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="5000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending || isUploading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {isEditing ? 'Изменить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
