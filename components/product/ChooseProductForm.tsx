import Image from 'next/image';
import { Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

import { Title } from '../shared';
import { IngredientItem } from './Ingredient';
import { totalProductPrice } from '@/lib';
import { Ingredient } from '@/types';

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
      className={cn('flex h-full', !isModal && 'max-w-4xl mx-auto', className)}
    >
      {/* Left: Image */}
      <div
        className={cn(
          'flex flex-1 justify-center items-center',
          !isModal && 'rounded-2xl overflow-hidden bg-[#FFF7EE]'
        )}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={300}
          className="object-cover"
        />
      </div>

      {/* Right: Form */}
      <div
        className={cn(
          'flex flex-col flex-1',
          isModal ? 'bg-[#f7f6f5]' : 'bg-white'
        )}
      >
        {/* Scrollable Area */}
        <div className="flex-1 p-7 overflow-y-auto scrollbar-thin">
          <Title text={name} size="md" className="mb-1" />
          <Title text="Ингредиенты" size="xs" className="mt-4 mb-2" />
          <div className="gap-2 grid grid-cols-3">
            {ingredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                selectedIngredients={selectedIngredients}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
                className={isModal ? '' : 'bg-[#f7f6f5]'}
              />
            ))}
          </div>
        </div>

        {/* Fixed Button */}
        <div className={cn('p-7 pt-0', isModal ? 'bg-[#f7f6f5]' : 'bg-white')}>
          <Button
            className="py-5 w-full"
            disabled={isPending}
            onClick={onAddToCart}
          >
            {isPending ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>Добавить в корзину за {totalPrice} ₽</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
