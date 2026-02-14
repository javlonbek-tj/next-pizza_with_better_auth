'use client';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { PizzaSize, PizzaType } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/lib';
import { DecimalInput } from '@/components/shared';

interface ProductItemCardProps {
  form: UseFormReturn<ProductFormValues>;
  index: number;
  pizzaSizes: PizzaSize[];
  pizzaTypes: PizzaType[];
  onRemove: (index: number) => void;
  disabled?: boolean;
  canRemove?: boolean;
  isPizza?: boolean;
}

export function ProductItemCard({
  form,
  index,
  pizzaSizes,
  pizzaTypes,
  onRemove,
  disabled,
  canRemove = true,
  isPizza = false,
}: ProductItemCardProps) {
  if (!isPizza) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <FormField
          control={form.control}
          name={`productItems.${index}.price`}
          render={({ field }) => {
            return (
              <FormItem className='flex-1'>
                <FormLabel className='font-medium text-md'>
                  Цена (₽) <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <DecimalInput {...field} className='h-10 max-w-xs' />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className='p-4 space-y-4 bg-white border rounded-lg shadow-sm'>
        <div className='flex items-center justify-between'>
          <h4 className='text-base font-medium'>Вариант #{index + 1}</h4>
          {canRemove && (
            <Button
              type='button'
              variant='destructive'
              size='sm'
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {/* Size */}
          <FormField
            control={form.control}
            name={`productItems.${index}.sizeId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Размер <span className='text-red-500'>*</span>
                </FormLabel>
                <Select
                  value={field.value ?? 'none'}
                  onValueChange={(val) =>
                    field.onChange(val === 'none' ? null : val)
                  }
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Выберите размер' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value='none'
                      disabled
                      className='text-muted-foreground'
                    >
                      Выберите размер
                    </SelectItem>
                    {pizzaSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name={`productItems.${index}.typeId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Тип теста <span className='text-red-500'>*</span>
                </FormLabel>
                <Select
                  value={field.value ?? 'none'}
                  onValueChange={(val) =>
                    field.onChange(val === 'none' ? null : val)
                  }
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Выберите тип теста' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value='none'
                      disabled
                      className='text-muted-foreground'
                    >
                      Выберите тип теста
                    </SelectItem>
                    {pizzaTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name={`productItems.${index}.price`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Цена (₽) <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <DecimalInput {...field} className='max-w-xs' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
}
