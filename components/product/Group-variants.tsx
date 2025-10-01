import { PizzaSize, PizzaType } from '@/constants';
import { cn } from '@/lib';

interface Props {
  className?: string;
  variants: Variant[];
  value: PizzaSize | PizzaType;
  onClick: (value: PizzaSize | PizzaType) => void;
}

export type Variant = {
  name: string;
  value: PizzaSize | PizzaType;
  disabled?: boolean;
};

export function GroupVariants({ className, variants, value, onClick }: Props) {
  return (
    <div
      className={cn(
        'flex justify-between bg-gray-200 mt-2 p-0.5 rounded-full',
        className
      )}
    >
      {variants.map((variant) => (
        <button
          key={variant.value}
          type='button'
          aria-pressed={variant.value === value}
          disabled={variant.disabled}
          className={cn(
            'flex-1 px-4 py-1.5 rounded-full cursor-pointer',
            variant.value === value && 'bg-white pointer-events-none',
            variant.disabled && 'pointer-events-none opacity-50'
          )}
          onClick={() => onClick(variant.value)}
        >
          {variant.name}
        </button>
      ))}
    </div>
  );
}
