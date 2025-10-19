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
  useCreateCategory,
  useUpdateCategory,
} from '@/hooks/admin/use-categories';
import { Category } from '@/lib/generated/prisma';
import { CategoryFormValues, categorySchema } from '../schemas';
import { generateSlug } from '@/lib';

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryFormDialog({ open, onClose, category }: Props) {
  const isEditing = !!category;
  const [isSlugManual, setIsSlugManual] = useState(false);

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
      setIsSlugManual(false);
    } else {
      form.reset({
        name: '',
        slug: '',
      });
      setIsSlugManual(false);
    }
  }, [category, form, open]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    form.setValue('name', value);

    // Only auto-generate if user hasn't manually edited the slug
    if (!isSlugManual) {
      const generatedSlug = generateSlug(value);
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  };

  const handleSlugChange = (value: string) => {
    setIsSlugManual(true);
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
            setIsSlugManual(false);
          },
        }
      );
    } else {
      createCategory(data, {
        onSuccess: () => {
          onClose();
          form.reset();
          setIsSlugManual(false);
        },
      });
    }
  };

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
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="cursor-pointer"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer"
              >
                {isEditing ? 'Изменить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
