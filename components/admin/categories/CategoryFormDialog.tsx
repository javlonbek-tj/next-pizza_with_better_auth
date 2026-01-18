'use client';

import { Category } from '@/lib/generated/prisma/browser';
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
} from '@/components/ui/form';
import { useCategoryForm } from '@/hooks';
import { FormActions } from '@/components/shared/FormActions';

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryFormDialog({ open, onClose, category }: Props) {
  const {
    form,
    isEditing,
    isPending,
    handleNameChange,
    handleSlugChange,
    onSubmit,
  } = useCategoryForm(category, open, onClose);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать категорию' : 'Создать категорию'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите название категории на кириллице"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug Field */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="автоматически генерируется"
                        {...field}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="font-mono text-sm"
                        autoComplete="off"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {form.watch('slug') && (
              <div className="bg-gray-50 p-3 border border-gray-200 rounded-lg">
                <p className="mb-1 font-medium text-gray-600 text-xs">
                  Предпросмотр URL:
                </p>
                <code className="font-mono text-violet-600 text-sm">
                  /categories/{form.watch('slug')}
                </code>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
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
