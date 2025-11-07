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
import { PizzaSize, PizzaType } from '@/lib/generated/prisma';
import { usePriceInput } from '@/hooks/admin/use-products';

interface ProductItemCardProps {
  item: any; // Changed from ProductItem to allow flexibility
  index: number;
  pizzaSizes: PizzaSize[];
  pizzaTypes: PizzaType[];
  onUpdate: (index: number, updated: any) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
  canRemove?: boolean;
  isPizzaCategory?: boolean;
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
}: ProductItemCardProps) {
  const { priceInput, handlePriceChange, handlePriceBlur } = usePriceInput(
    item?.price
  );

  return (
    <Card
      className={cn(
        'space-y-4 bg-white shadow-sm p-4 border rounded-lg',
        disabled && 'opacity-60 pointer-events-none'
      )}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-base">
          {isPizzaCategory ? `Вариант #${index + 1}` : 'Цена'}
        </h4>
        {canRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(index)}
            className="cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isPizzaCategory ? (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
          {/* Size Select */}
          <div className="space-y-1">
            <Label>
              Размер <span className="text-red-500">*</span>
            </Label>
            <Select
              value={item.sizeId || ''}
              onValueChange={(val) => onUpdate(index, { sizeId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите размер" />
              </SelectTrigger>
              <SelectContent>
                {pizzaSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Select */}
          <div className="space-y-1">
            <Label>
              Тип теста <span className="text-red-500">*</span>
            </Label>
            <Select
              value={item.typeId || ''}
              onValueChange={(val) => onUpdate(index, { typeId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип теста" />
              </SelectTrigger>
              <SelectContent>
                {pizzaTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Input */}
          <div className="space-y-1">
            <Label>
              Цена (₽) <span className="text-red-500">*</span>
            </Label>
            <Input
              inputMode="decimal"
              autoComplete="off"
              pattern="[0-9]*[.,]?[0-9]{0,2}"
              placeholder="5000.00"
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
      ) : (
        /* Simple price input for non-pizza products */
        <div className="space-y-1">
          <Label>
            Цена (₽) <span className="text-red-500">*</span>
          </Label>
          <Input
            inputMode="decimal"
            autoComplete="off"
            pattern="[0-9]*[.,]?[0-9]{0,2}"
            placeholder="5000.00"
            value={priceInput}
            onChange={(e) =>
              handlePriceChange(e.target.value, (val) =>
                onUpdate(index, { price: val })
              )
            }
            onBlur={() =>
              handlePriceBlur((val) => onUpdate(index, { price: val }))
            }
            className="max-w-xs"
          />
        </div>
      )}
    </Card>
  );
}
