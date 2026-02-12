import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionResult, Ingredient } from '@/types';
import { IngredientFormValues, ingredientSchema } from '@/lib';
import { createIngredient, updateIngredient } from '@/app/actions';

interface Props {
  ingredient: Ingredient | null;
  open: boolean;
  onClose: () => void;
  markAsSubmitted: () => void;
}

export function useIngredientForm({
  ingredient,
  open,
  onClose,
  markAsSubmitted,
}: Props) {
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

  return {
    isEditing,
    onSubmit,
    isPending,
    form,
  };
}
