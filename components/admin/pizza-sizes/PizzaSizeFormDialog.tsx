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
import { PizzaSize } from '@/types';
import { usePizzaSizeForm } from '@/hooks';
import { FormActions } from '@/components/shared/FormActions';
import { DecimalInput } from '@/components/shared';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaSize?: PizzaSize | null;
}

export function PizzaSizeFormDialog({ open, onClose, pizzaSize }: Props) {
  const { form, isEditing, isPending, onSubmit } = usePizzaSizeForm(
    pizzaSize,
    open,
    onClose
  );

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
