'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
import { PizzaSize, ActionResult } from '@/types';
import { FormActions } from '@/components/shared/FormActions';
import { DecimalInput } from '@/components/shared';
import { PizzaSizeFormValues, pizzaSizeSchema } from '../schemas';
import { createPizzaSize, updatePizzaSize } from '@/app/actions';
import { zodResolver } from '@hookform/resolvers/zod';


interface Props {
  open: boolean;
  onClose: () => void;
  pizzaSize?: PizzaSize | null;
}

export function PizzaSizeFormDialog({ open, onClose, pizzaSize }: Props) {
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
      if (pizzaSize) {
        form.reset({
          label: pizzaSize.label,
          size: pizzaSize.size,
        });
      } else {
        form.reset({
          label: '',
          size: 0,
        });
      }
    }, [pizzaSize, open, form]);

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
        toast.error(result.message || `Не удалось ${isEditing ? 'изменить' : 'создать'} размер пиццы`);
        return;
      }

      toast.success(`Размер пиццы успешно ${isEditing ? 'изменён' : 'создан'}`);
    
      onClose();
      form.reset();
    } catch (error) {
      toast.error(`Не удалось ${isEditing ? 'изменить' : 'создать'} размер пиццы`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать размер пиццы' : 'Создать размер пиццы'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Label Field */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например: Маленькая, Средняя, Большая"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size Field */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Значение (см)</FormLabel>
                  <FormControl>
                    <DecimalInput {...field} maxDecimals={0} placeholder="30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
