'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
import { ActionResult, Ingredient } from '@/types';
import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { useImageUpload } from '@/hooks';
import { IngredientFormValues, ingredientSchema } from '../schemas';
import { FormActions } from '@/components/shared/FormActions';
import { DecimalInput } from '@/components/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIngredient, updateIngredient } from '@/app/actions';

interface Props {
  open: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export function IngredientFormDialog({ open, onClose, ingredient }: Props) {
  const [isPending, setIsPending] = useState(false);

  const isEditing = !!ingredient;

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      price: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset(
      ingredient
        ? {
            name: ingredient.name,
            price: ingredient.price,
            imageUrl: ingredient.imageUrl,
          }
        : { name: '', price: 0, imageUrl: '' },
    );
  }, [open, ingredient, form]);

  const {
    previewUrl,
    isUploading,
    uploadFile,
    removeImage,
    cleanupOrphanedImage,
    markAsSubmitted,
  } = useImageUpload(
    ingredient?.imageUrl,
    open,
    'ingredients',
    ingredient?.imageUrl,
  );

  const onSubmit = async (data: IngredientFormValues) => {
    setIsPending(true);

    try {
      let result: ActionResult<Ingredient>;
      if (isEditing) {
        result = await updateIngredient(ingredient.id, data);
      } else {
        result = await createIngredient(data);
      }

      if (!result.success) {
        toast.error(
          result.message ||
            `Не удалось ${isEditing ? 'изменить' : 'создать'} ингредиент`,
        );
        return;
      }
      markAsSubmitted();
      toast.success(`Ингредиент успешно ${isEditing ? 'изменён' : 'создан'}`);
      onClose();
    } catch (error) {
      console.error('[IngredientFormDialog] Error:', error);
      toast.error(
        `Не удалось ${isEditing ? 'изменить' : 'создать'} ингредиент`,
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  const onRemove = async () => {
    await removeImage();
    form.setValue('imageUrl', '', { shouldValidate: true });
  };

  const handleUploadFile = async (file: File) => {
    const res = await uploadFile(file);
    if (!res.success) {
      form.setError('imageUrl', {
        type: 'manual',
        message: res.message,
      });
      return;
    }
    form.clearErrors('imageUrl');
    form.setValue('imageUrl', res.imageUrl, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать ингредиент' : 'Создать ингредиент'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Image Upload */}
            <FormField
              control={form.control}
              name='imageUrl'
              render={() => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <ImageUploadInput
                      value={previewUrl}
                      onUpload={handleUploadFile}
                      onRemove={onRemove}
                      isUploading={isUploading}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название (на русском)</FormLabel>
                  <FormControl>
                    <Input placeholder='Например: Сыр моцарелла' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <DecimalInput {...field} placeholder='17' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-4'>
              <FormActions
                onCancel={() => handleClose(false)}
                isPending={isPending}
                isLoading={isUploading}
                isEditing={isEditing}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
