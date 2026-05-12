import { useSet } from 'react-use';
import { useAddToCart } from '../use-cart';
import type { ProductWithRelations } from '@/types';

export const useProductDetail = (
  product: ProductWithRelations,
  onClose?: () => void,
  isModal?: boolean,
) => {
  const { mutate: addToCart, isPending } = useAddToCart();
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<string>([]),
  );

  const handleAddToCart = () => {
    addToCart(
      {
        productItemId: product.productItems[0].id,
        quantity: 1,
        ingredients: Array.from(selectedIngredients),
      },
      {
        onSuccess: () => {
          if (isModal) onClose?.();
        },
      },
    );
  };

  return {
    handleAddToCart,
    isPending,
    selectedIngredients,
    addIngredient,
    productItemId: product.productItems[0].id,
  };
};
