'use client';
import { Loader } from 'lucide-react';
import { cn } from '@/lib';
import { PizzaImage } from './PizzaImage';
import { Title } from '../shared';
import { usePizzaOptions } from '@/hooks';
import { GroupVariants, Variant } from './GroupVariants';
import { IngredientItem } from './Ingredient';
import { Button } from '../ui/button';
import { PizzaSize, PizzaType, ProductItem, ProductWithRelations } from '@/types';

interface Props {
  className?: string;
  product: ProductWithRelations;
  onAddToCart: () => void;
  isSubmitting: boolean;
  isModal: boolean;
  pizzaOptions: ReturnType<typeof usePizzaOptions>;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}

export function ChoosePizzaForm({
  className,
  product,
  onAddToCart,
  isSubmitting,
  isModal,
  pizzaOptions,
  pizzaSizes = [],
  pizzaTypes = [],
}: Props) {
  const {
    typeId,
    sizeId,
    setSizeId,
    setTypeId,
    selectedIngredients,
    addIngredient,
    totalPrice,
    availableSizes,
  } = pizzaOptions;

  const allPizzaSizes = pizzaSizes.map((pizzaSize): Variant => {
    return {
      name: pizzaSize.label,
      value: pizzaSize.id,
      disabled: !availableSizes.some((size) => size?.id === pizzaSize.id),
    };
  });

  const allPizzaTypes = pizzaTypes.map((pizzaType): Variant => {
    return {
      name: pizzaType.type,
      value: pizzaType.id,
      disabled: !product.productItems.some(
        (item: ProductItem) => item.typeId === pizzaType.id
      ),
    };
  });

  const description = `${
    pizzaSizes.find((size) => size.id === sizeId)?.size
  } см, ${pizzaTypes.find((type) => type.id === typeId)?.type} пицца`;

  const pizzaSize = pizzaSizes.find((size) => size.id === sizeId)?.size;

  return (
    <div
      className={cn(
        'flex h-full overflow-hidden',
        !isModal && ' max-w-5xl mx-auto ',
        className
      )}
    >
      <PizzaImage
        imageUrl={product.imageUrl}
        size={pizzaSize}
        className={isModal ? '' : 'rounded-2xl overflow-hidden bg-[#FFF7EE]'}
      />

      <div
        className={cn(
          'flex flex-col flex-1 overflow-hidden',
          isModal ? 'bg-[#f7f6f5]' : 'bg-white'
        )}
      >
        {/* Scrollable content */}
        <div
          className={cn(
            'flex-1 px-7 overflow-y-auto scrollbar-thin',
            isModal && 'py-4'
          )}
        >
          <Title text={product.name} size="md" />
          <p className="text-gray-400">{description}</p>

          <GroupVariants
            variants={allPizzaSizes}
            value={sizeId}
            onSelect={(value) => setSizeId(value)}
            className="mt-4"
          />

          <GroupVariants
            variants={allPizzaTypes}
            value={typeId}
            onSelect={(value) => setTypeId(value)}
            className="mt-3"
          />

          <Title text="Ингредиенты" size="xs" className="mt-4" />

          <div className="gap-2 grid grid-cols-3 mt-4 pb-4">
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
        </div>

        {/* Fixed button at bottom */}
        <div
          className={cn(
            'px-7',
            isModal ? 'py-4 bg-[#f7f6f5]' : 'bg-white pt-4'
          )}
        >
          <Button
            className="py-5 w-full cursor-pointer"
            disabled={isSubmitting}
            onClick={onAddToCart}
          >
            {isSubmitting ? (
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
