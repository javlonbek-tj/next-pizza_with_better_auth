import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormValues, categorySchema, generateSlug } from '@/lib';
import { Category } from '@/types';
import { createCategory, updateCategory } from '@/app/actions';

interface Props {
  category: Category | null;
  open: boolean;
  onClose: () => void;
}

export function useCategoryForm({ category, open, onClose }: Props) {
  const isEditing = !!category;

  const [isPending, setIsPending] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  useEffect(() => {
    form.reset({
      name: category?.name || '',
      slug: category?.slug || '',
    });
  }, [category, form, open]);

  const handleNameChange = (value: string) => {
    form.setValue('name', value);

    const generatedSlug = generateSlug(value);
    form.setValue('slug', generatedSlug, { shouldValidate: true });
  };

  const handleSlugChange = (value: string) => {
    form.setValue('slug', value);
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsPending(true);
    if (isEditing) {
      const result = await updateCategory(category.id, data);
      if (!result.success) {
        toast.error(result.message || 'Не удалось изменить категорию');
        return;
      }
      toast.success('Категория успешно изменена');
      form.reset();
      onClose();
    } else {
      const result = await createCategory(data);
      if (!result.success) {
        toast.error(result.message || 'Не удалось создать категорию');
        return;
      }
      toast.success('Категория успешно создана');
      form.reset();
      onClose();
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
