import Image from 'next/image';
import { Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

import { Title } from '../shared';
import { IngredientItem } from './Ingredient';
import { Ingredient } from '@/lib/generated/prisma';
import { totalProductPrice } from '@/lib';

interface Props {
  className?: string;
  imageUrl: string;
  name: string;
  price: number;
  onAddToCart: () => void;
  isPending: boolean;
  isModal: boolean;
  selectedIngredients: Set<string>;
  addIngredient: (id: string) => void;
  ingredients?: Ingredient[];
}

export function ChooseProductForm({
  className,
  imageUrl,
  name,
  price,
  onAddToCart,
  isPending,
  isModal,
  selectedIngredients,
  addIngredient,
  ingredients = [],
}: Props) {
  const totalPrice = totalProductPrice(price, ingredients, selectedIngredients);
  return (
    <div
      className={cn(
        'flex items-stretch',
        !isModal && 'max-w-4xl mx-auto',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-1 justify-center items-center',
          !isModal && 'rounded-2xl overflow-hidden bg-[#FFF7EE]'
        )}
      >
        <Image src={imageUrl} alt={name} width={300} height={300} />
      </div>
      <div
        className={cn(
          'flex flex-col flex-1 justify-between bg-[#f7f6f5] p-7',
          !isModal && 'bg-white py-0'
        )}
      >
        <Title text={name} size="md" />
        <Title text="Ингредиенты" size="xs" className="mt-4" />
        <div className="gap-2 grid grid-cols-3 mt-4 h-[340px] overflow-y-scroll scrollbar-thin">
          {ingredients.map((ingredient) => (
            <IngredientItem
              ingredient={ingredient}
              key={ingredient.id}
              selectedIngredients={selectedIngredients}
              onClick={() => addIngredient(ingredient.id)}
              active={selectedIngredients.has(ingredient.id)}
              className={isModal ? '' : 'bg-[#f7f6f5]'}
            />
          ))}
        </div>
        <Button
          className={cn(
            'mt-5 w-full cursor-pointer',
            isModal ? 'py-5 text-base' : 'py-3 text-sm max-w-xs mx-auto'
          )}
          disabled={isPending}
          onClick={onAddToCart}
        >
          {isPending ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            `Добавить в корзину за ${totalPrice} ₽`
          )}
        </Button>
      </div>
    </div>
  );
}
