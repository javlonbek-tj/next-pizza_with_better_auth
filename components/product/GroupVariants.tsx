import { cn } from '@/lib';

interface Props {
  className?: string;
  variants: Variant[];
  value: string;
  onSelect: (value: string) => void;
}

export type Variant = {
  name: string;
  value: string;
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
        const isSelected = variant.value === value;

        return (
          <button
            key={variant.value}
            type="button"
            aria-pressed={isSelected}
            disabled={variant.disabled}
            className={cn(
              'flex-1 px-4 py-1 rounded-full cursor-pointer',
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
