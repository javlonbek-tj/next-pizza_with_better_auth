import { createPizzaSize, updatePizzaSize } from '@/app/actions';
import { PizzaSizeFormValues, pizzaSizeSchema } from '@/lib';
import { ActionResult, PizzaSize } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaSize: PizzaSize | null;
}

export function usePizzaSizeForm({ pizzaSize, open, onClose }: Props) {
  const [isPending, setIsPending] = useState(false);

  const isEditing = !!pizzaSize;

  const form = useForm<PizzaSizeFormValues>({
    resolver: zodResolver(pizzaSizeSchema),
    defaultValues: {
      size: 0,
      label: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset(
      pizzaSize
        ? { label: pizzaSize.label, size: pizzaSize.size }
        : { label: '', size: 0 },
    );
  }, [open, pizzaSize, form]);

  const onSubmit = async (data: PizzaSizeFormValues) => {
    setIsPending(true);
    try {
      let result: ActionResult<PizzaSize>;
      if (isEditing) {
        result = await updatePizzaSize(pizzaSize.id, data);
      } else {
        result = await createPizzaSize(data);
      }

      if (!result.success) {
        toast.error(
          result.message ||
            `Не удалось ${isEditing ? 'изменить' : 'создать'} размер пиццы`,
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
    isEditing,
    isPending,
  };
}
