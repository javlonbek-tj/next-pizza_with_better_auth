'use client';

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
import { Ingredient } from '@/types';
import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { useImageUpload, useIngredientForm } from '@/hooks';
import { FormActions } from '@/components/shared/FormActions';
import { DecimalInput } from '@/components/shared';

interface Props {
  open: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
}

export function IngredientFormDialog({ open, onClose, ingredient }: Props) {
  const {
    previewUrl,
    removeImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    uploadFile,
    isUploading: isImageUploading,
  } = useImageUpload(
    ingredient?.imageUrl,
    open,
    'ingredients',
    ingredient?.imageUrl,
  );

  const { isEditing, onSubmit, isPending, form } = useIngredientForm({
    ingredient,
    open,
    onClose,
    markAsSubmitted,
  });

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  const handleRemoveImage = async () => {
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
    form.setValue('imageUrl', res.data?.imageUrl || '', {
      shouldValidate: true,
    });
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
                      onRemove={handleRemoveImage}
                      isUploading={isImageUploading}
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
                isLoading={isImageUploading}
                isEditing={isEditing}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
