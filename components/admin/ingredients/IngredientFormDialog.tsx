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
import { Ingredient } from '@/lib/generated/prisma';
import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { useImageUpload, useIngredientForm } from '@/hooks';
import { IngredientFormValues } from '../schemas';
import { FormActions } from '@/components/shared/FormActions';
import { DecimalInput } from '@/components/shared';

interface Props {
  open: boolean;
  onClose: () => void;
  ingredient?: Ingredient | null;
}

export function IngredientFormDialog({ open, onClose, ingredient }: Props) {
  const { form, isEditing, isPending, onSubmit } = useIngredientForm(
    ingredient,
    open,
    onClose
  );

  const {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  } = useImageUpload(
    ingredient?.imageUrl,
    open,
    {
      setValue: form.setValue,
      setError: form.setError,
      clearErrors: form.clearErrors,
    },
    'ingredients'
  );

  const handleSubmit = (data: IngredientFormValues) => {
    onSubmit(data, () => {
      markAsSubmitted();
      resetImageState();
    });
  };

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать ингредиент' : 'Создать ингредиент'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            {/* Image Upload */}
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение</FormLabel>
                  <FormControl>
                    <ImageUploadInput
                      value={previewUrl}
                      onChange={field.onChange}
                      onUpload={uploadFile}
                      onRemove={handleRemoveImage}
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
                    <DecimalInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-4'>
              <FormActions
                onCancel={onClose}
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
