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

interface ProductItemCardProps {
  item: ProductItem;
  index: number;
  pizzaSizes: PizzaSize[];
  pizzaTypes: PizzaType[];
  onUpdate: (index: number, updated: Partial<ProductItem>) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  canRemove?: boolean;
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
}: ProductItemCardProps) {
  const { priceInput, handlePriceChange, handlePriceBlur } = usePriceInput(
    item?.price
  );

  return (
    <Card
      className={cn(
        'p-4 border rounded-lg space-y-4 bg-white shadow-sm',
        disabled && 'opacity-60 pointer-events-none'
      )}
    >
      <div className='flex items-center justify-between'>
        <h4 className='font-medium text-base'>Вариант #{index + 1}</h4>
        {canRemove && (
          <Button
            type='button'
            variant='destructive'
            size='sm'
            onClick={() => onRemove(index)}
            className='cursor-pointer'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {/* Size Select */}
        <div className='space-y-1'>
          <Label>Размер</Label>
          <Select
            value={item.sizeId ?? 'none'}
            onValueChange={(val) =>
              onUpdate(index, { sizeId: val === 'none' ? null : val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Выберите размер' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>Без размера</SelectItem>
              {pizzaSizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Select */}
        <div className='space-y-1'>
          <Label>Тип теста</Label>
          <Select
            value={item.typeId ?? 'none'}
            onValueChange={(val) =>
              onUpdate(index, { typeId: val === 'none' ? null : val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Выберите тип теста' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>Без типа</SelectItem>
              {pizzaTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Input */}
        <div className='space-y-1'>
          <Label>Цена (₽)</Label>
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
          />
        </div>
      </div>
    </Card>
  );
}
