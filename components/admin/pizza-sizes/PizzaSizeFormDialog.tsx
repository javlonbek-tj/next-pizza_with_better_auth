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
  useCreatePizzaSize,
  useUpdatePizzaSize,
} from '@/hooks/admin/use-pizza-sizes';
import { PizzaSize } from '@/lib/generated/prisma';
import { PizzaSizeFormValues, pizzaSizeSchema } from '../schemas';

interface Props {
  open: boolean;
  onClose: () => void;
  pizzaSize?: PizzaSize | null;
}

export function PizzaSizeFormDialog({ open, onClose, pizzaSize }: Props) {
  const [sizeInput, setSizeInput] = useState('');
  const isEditing = !!pizzaSize;

  const { mutate: createPizzaSize, isPending: isCreating } =
    useCreatePizzaSize();
  const { mutate: updatePizzaSize, isPending: isUpdating } =
    useUpdatePizzaSize();
  const isPending = isCreating || isUpdating;

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
        size: pizzaSize.size,
        label: pizzaSize.label,
      });
      setSizeInput(pizzaSize.size.toString());
    } else {
      form.reset({
        size: 0,
        label: '',
      });
      setSizeInput('');
    }
  }, [pizzaSize, form, open]);

  const onSubmit = (data: PizzaSizeFormValues) => {
    if (isEditing) {
      updatePizzaSize(
        { id: pizzaSize.id, dto: data },
        {
          onSuccess: () => {
            onClose();
            form.reset();
            setSizeInput('');
          },
        }
      );
    } else {
      createPizzaSize(data, {
        onSuccess: () => {
          onClose();
          form.reset();
          setSizeInput('');
        },
      });
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
            {/* Name Field */}
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

            {/* Value Field */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Значение (см)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      pattern="[0-9]*"
                      placeholder="Например: 25"
                      value={sizeInput}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Allow empty input
                        if (value === '') {
                          setSizeInput('');
                          field.onChange(0);
                          return;
                        }

                        // Allow only digits (no decimals, no negatives)
                        if (!/^\d+$/.test(value)) {
                          return;
                        }

                        setSizeInput(value);

                        // Parse to number for Zod validation
                        const numValue = parseInt(value, 10);
                        field.onChange(isNaN(numValue) ? 0 : numValue);
                      }}
                      onBlur={() => {
                        // If left empty, normalize to 0
                        if (sizeInput === '') {
                          field.onChange(0);
                          return;
                        }

                        const numValue = parseInt(sizeInput, 10);
                        if (!isNaN(numValue)) {
                          setSizeInput(numValue.toString());
                          field.onChange(numValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
