'use client';

import { Category } from '@/types';
import { Input } from '@/components/ui/input';
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
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategoryForm } from '@/hooks';
import { FormActions } from '@/components/shared/FormActions';

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

export function CategoryFormDialog({ open, onClose, category }: Props) {
  const {
    form,
    isEditing,
    isPending,
    handleNameChange,
    handleSlugChange,
    onSubmit,
  } = useCategoryForm({ category, open, onClose });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать категорию' : 'Создать категорию'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Введите название категории на кириллице'
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                      autoComplete='off'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug Field */}
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        placeholder='автоматически генерируется'
                        {...field}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className='font-mono text-sm'
                        autoComplete='off'
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Pizza Toggle */}
            <FormField
              control={form.control}
              name='isPizza'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center p-4 space-x-3 space-y-0 border rounded-md bg-gray-50/50'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-base font-semibold cursor-pointer'>
                      Категория пиццы
                    </FormLabel>
                    <FormDescription>
                      Включите, если эта категория предназначена для пицц (будут
                      доступны специальные настройки)
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Preview */}
            {form.watch('slug') && (
              <div className='p-3 border border-gray-200 rounded-lg bg-gray-50'>
                <p className='mb-1 text-xs font-medium text-gray-600'>
                  Предпросмотр URL:
                </p>
                <code className='font-mono text-sm text-violet-600'>
                  /categories/{form.watch('slug')}
                </code>
              </div>
            )}

            {/* Actions */}
            <div className='flex justify-end gap-2 pt-4'>
              <FormActions
                onCancel={onClose}
                isEditing={isEditing}
                isPending={isPending}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
