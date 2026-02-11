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
import { ActionResult, PizzaType } from '@/types';
import { FormActions } from '@/components/shared/FormActions';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PizzaTypeFormValues, pizzaTypeSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPizzaType, updatePizzaType } from '@/app/actions';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaType?: PizzaType | null;
}

export function PizzaTypeFormDialog({ open, onClose, pizzaType }: Props) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать тип пиццы' : 'Создать тип пиццы'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Type Field */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Например: Тонкое, Традиционное'
                      {...field}
                      autoComplete='off'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
