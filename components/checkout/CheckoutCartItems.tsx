'use client';

import { useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { CheckoutCard } from './checkout-card';
import { CheckoutCartItem } from './checkout-cart-item';
import { useClearCart } from '@/hooks';
import { cn } from '@/lib';
import { CartItemModel } from '../cart/CartItemType';
import { useCheckoutState } from '@/store/checkout-state';

interface Props {
  cartItems: CartItemModel[];
  isProcessing?: boolean;
}

export function CheckoutCartItems({ cartItems, isProcessing }: Props) {
  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const { setIsProcessing } = useCheckoutState();

  useEffect(() => {
    setIsProcessing(isClearing);
  }, [isClearing, setIsProcessing]);

  const isDisabled = isClearing || isProcessing;

  return (
    <CheckoutCard
      title='1. Корзина'
      endAdornment={
        cartItems.length > 0 && (
          <button
            className={cn(
              'flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500'
            )}
            onClick={() => clearCart()}
            disabled={isDisabled}
            type='button'
          >
            {isClearing ? (
              <Loader2 className='w-4 h-4 text-gray-500 animate-spin' />
            ) : (
              <Trash2 className='w-4 h-4' />
            )}
            <span>Удалить корзину</span>
          </button>
        )
      }
    >
      <div className='flex flex-col divide-y divide-gray-100'>
        {cartItems.map((cartItem) => (
          <CheckoutCartItem
            key={cartItem.id}
            cartItem={cartItem}
            className={cn(
              'transition-opacity duration-200',
              isDisabled && 'pointer-events-none opacity-50'
            )}
          />
        ))}
      </div>
    </CheckoutCard>
  );
}
