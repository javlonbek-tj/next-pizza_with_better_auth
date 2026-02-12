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

import { FormActions } from '@/components/shared/FormActions';
import { usePizzaTypeForm } from '@/hooks/admin';
import { PizzaType } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaType: PizzaType | null;
}

export function PizzaTypeFormDialog({ open, onClose, pizzaType }: Props) {
  const { form, onSubmit, isPending, isEditing } = usePizzaTypeForm({
    open,
    onClose,
    pizzaType,
  });

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
