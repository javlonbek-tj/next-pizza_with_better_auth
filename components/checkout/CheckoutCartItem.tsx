import Image from 'next/image';
import { CartUpdateButtons } from '../cart';
import { RemoveCartItem } from '../cart/RemoveCartItem';
import { cn } from '@/lib';
import type { CartItemDetails } from '@/types';

interface Props {
  cartItem: CartItemDetails;
  className?: string;
}

export function CheckoutCartItem({ cartItem, className }: Props) {
  return (
    <div
      className={cn('flex justify-between items-center gap-3 py-2', className)}
    >
      {/* Left: image + details */}
      <div className='flex items-center flex-1 min-w-0 gap-3'>
        <Image
          src={cartItem.imageUrl}
          alt={cartItem.name}
          width={60}
          height={60}
          className='rounded-full shrink-0'
        />
        <div>
          <p className='font-bold'>{cartItem.name}</p>
          <p className='text-sm text-gray-400'>
            {cartItem.ingredients.map((ing) => ing.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Center: price */}
      <p className='w-20 text-base font-bold text-center text-gray-900'>
        {cartItem.totalCartItemPrice} ₽
      </p>

      {/* Right: quantity controls */}
      <div className='flex items-center gap-5 ml-20'>
        <CartUpdateButtons
          id={cartItem.id}
          quantity={cartItem.quantity}
          cartBtnSize='sm'
        />

        <RemoveCartItem
          id={cartItem.id}
          className='text-gray-400 cursor-pointer hover:text-red-500'
        />
      </div>
    </div>
  );
}
