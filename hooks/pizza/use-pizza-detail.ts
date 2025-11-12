import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useAddToCart } from '../use-cart';
import { usePizzaOptions } from '../filter';

export const usePizzaDetail = (
  product: ProductWithRelations,
  onClose?: () => void,
  isModal?: boolean
) => {
  const pizzaOptions = usePizzaOptions(product);
  const { mutate: addToCart, isPending: isSubmitting } = useAddToCart();

  const handleAddToCart = () => {
    addToCart({
      productItemId:
        pizzaOptions.selectedPizzaItemId ?? product.productItems[0].id,
      quantity: 1,
      ingredients: Array.from(pizzaOptions.selectedIngredients),
    });

    if (isModal) {
      onClose?.();
    }
  };

  return { pizzaOptions, handleAddToCart, isSubmitting };
};
