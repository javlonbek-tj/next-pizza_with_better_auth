'use client';

import { Trash2 } from 'lucide-react';
import { CheckoutCard } from './checkout-card';
import { CheckoutCartItem } from './checkout-cart-item';
import { useCart } from '@/hooks';

export function CheckoutCartItems() {
  const { data: cartItems, isPending, isError } = useCart();

  if (isPending && !isError) {
    return <p className='text-gray-400'>Загрузка...</p>;
  }

  return (
    <CheckoutCard
      title='1. Корзина'
      endAdornment={
        <div className='flex items-center gap-2 text-gray-500 cursor-pointer'>
          <Trash2 className='w-4 h-4' /> <span>Удалить корзину</span>
        </div>
      }
    >
      <div className='flex flex-col divide-y divide-gray-100'>
        {cartItems?.map((cartItem) => (
          <CheckoutCartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </div>
    </CheckoutCard>
  );
}
