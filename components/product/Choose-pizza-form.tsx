'use client';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { cn } from '@/lib';

import { PizzaImage } from './Pizza-image';
import { Title } from '../shared';
import { PizzaSize, PizzaType, pizzaTypes } from '@/constants';

import { usePizzaOptions } from '../hooks';
import { GroupVariants } from './Group-variants';
import { IngredientItem } from './Ingredient';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { InvalidPizzaItems } from './Invalid-pizza-items';

interface Props {
  className?: string;
  product: ProductWithRelations;
  onAddToCart: () => void;
  isPending: boolean;
  isModal: boolean;
}

export function ChoosePizzaForm({
  className,
  product,
  onAddToCart,
  isPending,
  isModal,
}: Props) {
  const {
    allPizzaSizes,
    type,
    size,
    setSize,
    setType,
    selectedIngredients,
    addIngredient,
    description,
    hasValidPizzaItems,
    error,
    totalPrice,
  } = usePizzaOptions(product);
  if (!hasValidPizzaItems) {
    return <InvalidPizzaItems error={error} />;
  }
  return (
    <div className={cn('flex', !isModal && ' max-w-5xl mx-auto ', className)}>
      <PizzaImage
        imageUrl={product.imageUrl}
        size={size}
        className={isModal ? '' : 'rounded-2xl overflow-hidden bg-[#FFF7EE]'}
      />
      <div
        className={cn(
          'flex-1 p-7 h-full',
          isModal ? 'bg-[#f7f6f5]' : 'bg-white py-0'
        )}
      >
        <Title text={product.name} size="md" />
        <p className="text-gray-400">{description}</p>
        <GroupVariants
          variants={allPizzaSizes}
          value={size}
          onClick={(value) => setSize(value as PizzaSize)}
          className="mt-4"
        />
        <GroupVariants
          variants={pizzaTypes}
          value={type}
          onClick={(value) => setType(value as PizzaType)}
          className="mt-3"
        />
        <Title text="Ингредиенты" size="xs" className="mt-4" />
        <div className="gap-2 grid grid-cols-3 mt-4 h-[340px] overflow-y-scroll scrollbar-thin">
          {product.ingredients.map((ingredient) => (
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
          className="mt-5 py-5 w-full cursor-pointer"
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
  );
}
