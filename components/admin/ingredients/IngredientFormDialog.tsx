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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Ingredient } from '@/lib/generated/prisma';
import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { useImageUpload, useIngredientForm, usePriceInput } from '@/hooks';
import { IngredientFormValues } from '../schemas';

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

  const { priceInput, handlePriceChange, handlePriceBlur } = usePriceInput(
    ingredient,
    open
  );

  const {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  } = useImageUpload(ingredient, open, form);

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
                    <Input
                      type='text'
                      inputMode='decimal'
                      autoComplete='off'
                      pattern='[0-9]*[.,]?[0-9]{0.2}'
                      placeholder='5000.00'
                      value={priceInput}
                      onChange={(e) =>
                        handlePriceChange(e.target.value, field.onChange)
                      }
                      onBlur={() => handlePriceBlur(field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleClose(false)}
                disabled={isPending || isUploading}
                className={`cursor-pointer min-w-[90px] transition-colors ${
                  isPending || isUploading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-muted'
                }`}
              >
                Отмена
              </Button>

              <Button
                type='submit'
                disabled={isPending || isUploading}
                className='min-w-[110px] cursor-pointer'
              >
                {isPending ? (
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                ) : (
                  <>{isEditing ? 'Изменить' : 'Создать'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
