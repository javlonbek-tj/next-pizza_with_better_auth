import { cn } from '@/lib';
import { PizzaSize, PizzaType } from '@/lib/generated/prisma';

interface Props {
  className?: string;
  variants: Variant[];
  value: PizzaSize | PizzaType;
  onSelect: (value: PizzaSize | PizzaType) => void;
}

export type Variant = {
  name: string;
  value: PizzaSize | PizzaType;
  disabled?: boolean;
};

export function GroupVariants({ className, variants, value, onSelect }: Props) {
  return (
    <div
      className={cn(
        'flex justify-between bg-gray-200 mt-2 p-0.5 rounded-full',
        className
      )}
    >
      {variants.map((variant) => {
        const isSelected = variant.value.id === value?.id;

        return (
          <button
            key={variant.value.id}
            type='button'
            aria-pressed={isSelected}
            disabled={variant.disabled}
            className={cn(
              'flex-1 px-4 py-1.5 rounded-full cursor-pointer',
              isSelected && 'bg-white pointer-events-none',
              variant.disabled && 'pointer-events-none opacity-50'
            )}
            onClick={() => onSelect(variant.value)}
          >
            {variant.name}
          </button>
        );
      })}
    </div>
  );
}
