'use client';

import { CheckoutCartItem } from './checkout-cart-item';
import { useCart } from '@/hooks';

export function CheckoutCartItems() {
  const { data: cartItems, isPending, isError } = useCart();

  if (isPending && !isError) {
    return <p className="text-gray-400">Загрузка...</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {cartItems?.map((cartItem) => (
        <CheckoutCartItem key={cartItem.id} cartItem={cartItem} />
      ))}
    </div>
  );
}
