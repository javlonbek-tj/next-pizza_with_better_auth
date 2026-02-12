import { ActionResult, PizzaType } from '@/types';
import { PizzaTypeFormValues, pizzaTypeSchema } from '@/lib';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPizzaType, updatePizzaType } from '@/app/actions';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaType: PizzaType | null;
}

export function usePizzaTypeForm({ open, onClose, pizzaType }: Props) {
  const [isPending, setIsPending] = useState(false);

  const isEditing = !!pizzaType;

  const form = useForm<PizzaTypeFormValues>({
    resolver: zodResolver(pizzaTypeSchema),
    defaultValues: {
      type: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset(pizzaType ? { type: pizzaType.type } : { type: '' });
  }, [open, pizzaType, form]);

  const onSubmit = async (data: PizzaTypeFormValues) => {
    setIsPending(true);
    try {
      let result: ActionResult<PizzaType>;
      if (isEditing) {
        result = await updatePizzaType(pizzaType.id, data);
      } else {
        result = await createPizzaType(data);
      }

      if (!result.success) {
        toast.error(
          result.message ||
            `Не удалось ${isEditing ? 'изменить' : 'создать'} тип пиццы`,
        );
        return;
      }

      toast.success(`Размер пиццы успешно ${isEditing ? 'изменён' : 'создан'}`);

      onClose();
      form.reset();
    } catch (error) {
      console.error('[PizzaSizeFormDialog] Error:', error);
      toast.error(
        `Не удалось ${isEditing ? 'изменить' : 'создать'} размер пиццы`,
      );
    } finally {
      setIsPending(false);
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    isEditing,
  };
}
