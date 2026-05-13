'use client';

import Image from 'next/image';
import { Loader } from 'lucide-react';

import { Button } from '../ui/button';
import { Title } from '../shared';
import { IngredientItem } from './Ingredient';
import { CartUpdateButtons } from '../cart/CartUpdateButtons';
import { totalProductPrice, cn } from '@/lib';
import { useCart } from '@/hooks';
import { Ingredient } from '@/types';

interface Props {
  className?: string;
  imageUrl: string;
  name: string;
  price: number;
  productItemId: string;
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
  productItemId,
  onAddToCart,
  isPending,
  isModal,
  selectedIngredients,
  addIngredient,
  ingredients = [],
}: Props) {
  const { data: cartItems, isPending: isCartPending } = useCart();
  const totalPrice = totalProductPrice(price, ingredients, selectedIngredients);

  const currentItemId = !isCartPending
    ? cartItems?.find(
        (item) =>
          item.productItemId === productItemId &&
          item.ingredients.length === selectedIngredients.size &&
          item.ingredients.every((ingredient) =>
            selectedIngredients.has(ingredient.id),
          ),
      )?.id
    : undefined;

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row h-full overflow-hidden',
        !isModal && 'max-w-5xl mx-auto',
        className,
      )}
    >
      {/* Left: Image */}
      <div
        className={cn(
          'flex md:w-md shrink-0 justify-center items-center py-6 md:py-0',
          !isModal && 'rounded-2xl overflow-hidden bg-[#FFF7EE]',
        )}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={300}
          className='object-cover'
        />
      </div>

      {/* Right: Form */}
      <div
        className={cn(
          'flex flex-col flex-1',
          isModal ? 'bg-[#f7f6f5]' : 'bg-white',
        )}
      >
        {/* Scrollable Area */}
        <div className='flex-1 overflow-y-auto p-7 scrollbar-thin'>
          <Title text={name} size='md' className='mb-1' />
          {ingredients?.length > 0 && (
            <>
              <Title text='Ингредиенты' size='xs' className='mt-4 mb-2' />
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
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
            </>
          )}
        </div>

        {/* Fixed Button */}
        <div
          className={cn(
            'px-7',
            isModal ? 'py-4 bg-[#f7f6f5]' : 'bg-white pt-4',
          )}
        >
          {currentItemId ? (
            <div className='flex items-center justify-between w-full px-5 py-6 text-base font-bold rounded-sm bg-secondary h-9'>
              <span className='text-gray-500'>
                В корзине:{' '}
                {cartItems?.find((item) => item.id === currentItemId)?.quantity}
              </span>
              <CartUpdateButtons
                id={currentItemId}
                quantity={
                  cartItems?.find((item) => item.id === currentItemId)
                    ?.quantity || 0
                }
              />
            </div>
          ) : (
            <Button
              className='w-full py-5 cursor-pointer'
              disabled={isPending}
              onClick={onAddToCart}
            >
              {isPending ? (
                <Loader className='w-5 h-5 animate-spin' />
              ) : (
                <>Добавить в корзину за {totalPrice} ₽</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
