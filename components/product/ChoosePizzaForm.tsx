'use client';
import { Loader } from 'lucide-react';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { cn } from '@/lib';
import { PizzaImage } from './PizzaImage';
import { Title } from '../shared';
import { usePizzaOptions } from '@/hooks';
import { GroupVariants } from './GroupVariants';
import { IngredientItem } from './Ingredient';
import { Button } from '../ui/button';
import { InvalidPizzaItems } from './InvalidPizzaItems';

interface Props {
  className?: string;
  product: ProductWithRelations;
  onAddToCart: () => void;
  isPending: boolean;
  isModal: boolean;
  pizzaOptions: ReturnType<typeof usePizzaOptions>;
}

export function ChoosePizzaForm({
  className,
  product,
  onAddToCart,
  isPending,
  isModal,
  pizzaOptions,
}: Props) {
  const {
    allPizzaSizes,
    allPizzaTypes,
    typeId,
    sizeId,
    setSizeId,
    setTypeId,
    selectedIngredients,
    addIngredient,
    description,
    hasValidPizzaItems,
    error,
    totalPrice,
    isPending: isOptionsPending,
    pizzaSize,
  } = pizzaOptions;

  if (isOptionsPending) {
    return (
      <div className='flex items-center justify-center h-[500px]'>
        <Loader className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (!hasValidPizzaItems) {
    return <InvalidPizzaItems error={error} />;
  }

  return (
    <div className={cn('flex', !isModal && ' max-w-5xl mx-auto ', className)}>
      <PizzaImage
        imageUrl={product.imageUrl}
        size={pizzaSize}
        className={isModal ? '' : 'rounded-2xl overflow-hidden bg-[#FFF7EE]'}
      />
      <div
        className={cn(
          'flex-1 p-7 h-full',
          isModal ? 'bg-[#f7f6f5]' : 'bg-white py-0'
        )}
      >
        <Title text={product.name} size='md' />
        <p className='text-gray-400'>{description}</p>
        <GroupVariants
          variants={allPizzaSizes}
          value={sizeId}
          onSelect={(value) => setSizeId(value)}
          className='mt-4'
        />
        <GroupVariants
          variants={allPizzaTypes}
          value={typeId}
          onSelect={(value) => setTypeId(value)}
          className='mt-3'
        />
        <Title text='Ингредиенты' size='xs' className='mt-4' />
        <div className='gap-2 grid grid-cols-3 mt-4 h-[340px] overflow-y-scroll scrollbar-thin'>
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
          className='w-full py-5 mt-5 cursor-pointer'
          disabled={isPending}
          onClick={onAddToCart}
        >
          {isPending ? (
            <Loader className='w-5 h-5 animate-spin' />
          ) : (
            <>Добавить в корзину за {totalPrice} ₽</>
          )}
        </Button>
      </div>
    </div>
  );
}
