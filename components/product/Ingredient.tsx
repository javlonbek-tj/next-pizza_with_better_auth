import { Ingredient } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface Props {
  className?: string;
  ingredient: Ingredient;
  active?: boolean;
  selectedIngredients: Set<string>;
  onClick: () => void;
}

export function IngredientItem({
  className,
  ingredient,
  active,
  onClick,
}: Props) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2 bg-white p-1 border border-transparent rounded-3xl h-[160px] cursor-pointer',
        { 'border border-primary': active },
        className
      )}
      onClick={onClick}
    >
      {active && (
        <span className="top-2 right-2 absolute flex justify-center items-center border border-primary rounded-full w-5 h-5">
          <Check className="w-4 h-4 text-primary" />
        </span>
      )}
      <Image
        src={ingredient.imageUrl}
        width={60}
        height={60}
        alt={ingredient.name}
      />
      <p className="text-center leading-none">{ingredient.name}</p>
      <p className="mt-auto">{ingredient.price} ₽</p>
    </div>
  );
}
