'use client';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ProductItem, PizzaSize, PizzaType } from '@/lib/generated/prisma';
import { usePriceInput } from '@/hooks/admin/use-products';
import { ProductItemFormValues } from '../schemas/product-schema';

interface ProductItemCardProps {
  item: ProductItemFormValues;
  index: number;
  pizzaSizes: PizzaSize[];
  pizzaTypes: PizzaType[];
  onUpdate: (index: number, updated: Partial<ProductItem>) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  canRemove?: boolean;
  isPizzaCategory?: boolean;
  errors?: {
    price?: { message?: string };
    sizeId?: { message?: string };
    typeId?: { message?: string };
  };
}

export function ProductItemCard({
  item,
  index,
  pizzaSizes,
  pizzaTypes,
  onUpdate,
  onRemove,
  disabled,
  canRemove = true,
  isPizzaCategory = false,
  errors,
}: ProductItemCardProps) {
  const { priceInput, handlePriceChange, handlePriceBlur } = usePriceInput(
    item?.price
  );

  // --- Non-pizza: inline ---
  if (!isPizzaCategory) {
    return (
      <div className='flex items-end gap-3'>
        <div className='flex-1 space-y-1'>
          <Label
            className={cn(
              'font-medium text-md',
              errors?.price && 'text-destructive'
            )}
          >
            Цена (₽) <span className='text-red-500'>*</span>
          </Label>
          <Input
            inputMode='decimal'
            autoComplete='off'
            pattern='[0-9]*[.,]?[0-9]{0,2}'
            placeholder='5000.00'
            value={priceInput}
            onChange={(e) =>
              handlePriceChange(e.target.value, (val) =>
                onUpdate(index, { price: val })
              )
            }
            onBlur={() =>
              handlePriceBlur((val) => onUpdate(index, { price: val }))
            }
            disabled={disabled}
            className={cn(
              'max-w-xs',
              errors?.price &&
                'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errors?.price && (
            <p className='mt-1 text-sm text-red-500'>{errors.price.message}</p>
          )}
        </div>

        {canRemove && (
          <Button
            type='button'
            variant='destructive'
            size='icon'
            onClick={() => onRemove(index)}
            disabled={disabled}
            className='mb-1'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        )}
      </div>
    );
  }

  // --- Pizza category card ---
  return (
    <>
      <Card
        className={cn(
          'p-4 border rounded-lg space-y-4 bg-white shadow-sm',
          disabled && 'opacity-60 pointer-events-none',
          (errors?.price || errors?.sizeId || errors?.typeId) &&
            'border-destructive'
        )}
      >
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
          <div className='space-y-1'>
            <Label>
              Размер <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={item.sizeId ?? 'none'}
              onValueChange={(val) =>
                onUpdate(index, { sizeId: val === 'none' ? null : val })
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  errors?.sizeId && 'border-destructive focus:ring-destructive'
                )}
              >
                <SelectValue placeholder='Выберите размер' />
              </SelectTrigger>
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
            {errors?.sizeId && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.sizeId.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div className='space-y-1'>
            <Label>
              Тип теста <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={item.typeId ?? 'none'}
              onValueChange={(val) =>
                onUpdate(index, { typeId: val === 'none' ? null : val })
              }
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  errors?.typeId && 'border-destructive focus:ring-destructive'
                )}
              >
                <SelectValue placeholder='Выберите тип теста' />
              </SelectTrigger>
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
            {errors?.typeId && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.typeId.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className='space-y-1'>
            <Label>
              Цена (₽) <span className='text-red-500'>*</span>
            </Label>
            <Input
              inputMode='decimal'
              autoComplete='off'
              pattern='[0-9]*[.,]?[0-9]{0,2}'
              placeholder='5000.00'
              value={priceInput}
              onChange={(e) =>
                handlePriceChange(e.target.value, (val) =>
                  onUpdate(index, { price: val })
                )
              }
              onBlur={() =>
                handlePriceBlur((val) => onUpdate(index, { price: val }))
              }
              disabled={disabled}
              className={cn(
                errors?.price &&
                  'border-destructive focus-visible:ring-destructive'
              )}
            />
            {errors?.price && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.price.message}
              </p>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
