'use client';

import { useEffect } from 'react';
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

import { PizzaType } from '@/lib/generated/prisma';

import {
  PizzaTypeFormValues,
  pizzaTypeSchema,
} from '../schemas/pizza-type-schema';

import {
  useCreatePizzaType,
  useUpdatePizzaType,
} from '@/hooks/admin/use-pizza-types';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaType?: PizzaType | null;
}

export function PizzaTypeFormDialog({ open, onClose, pizzaType }: Props) {
  const isEditing = !!pizzaType;

  const { mutate: createPizzaType, isPending: isCreating } =
    useCreatePizzaType();
  const { mutate: updatePizzaType, isPending: isUpdating } =
    useUpdatePizzaType();
  const isPending = isCreating || isUpdating;

  const form = useForm<PizzaTypeFormValues>({
    resolver: zodResolver(pizzaTypeSchema),
    defaultValues: {
      type: '',
    },
  });

  useEffect(() => {
    if (pizzaType) {
      form.reset({
        type: pizzaType.type,
      });
    } else {
      form.reset({
        type: '',
      });
    }
  }, [pizzaType, form, open]);

  const onSubmit = (data: PizzaTypeFormValues) => {
    if (isEditing) {
      updatePizzaType(
        { id: pizzaType.id, dto: data },
        {
          onSuccess: () => {
            onClose();
            form.reset();
          },
        }
      );
    } else {
      createPizzaType(data, {
        onSuccess: () => {
          onClose();
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать размер пиццы' : 'Создать размер пиццы'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name Field */}
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
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isPending}
                className='cursor-pointer'
              >
                Отмена
              </Button>
              <Button
                type='submit'
                disabled={isPending}
                className='cursor-pointer'
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
