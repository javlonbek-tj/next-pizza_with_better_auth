'use client';

import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';

import { CartDrawer } from './CartDrawer';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks';
import { calculateTotalAmount } from '@/lib/cart';
import { CartButtonSkeleton } from '../skeletons';

interface Props {
  className?: string;
}

export function CartButton({ className }: Props) {
  const { data: cartItems, isPending, isError } = useCart();

  if (isPending && !isError) {
    return <CartButtonSkeleton />;
  }

  if (isError) {
    return (
      <Button className={cn('flex items-center min-w-30', className)} disabled>
        <span className='text-sm text-red-500'>Ошибка</span>
      </Button>
    );
  }

  const totalAmount = cartItems?.length ? calculateTotalAmount(cartItems) : 0;
  const totalItems = cartItems?.length || 0;

  return (
    <CartDrawer>
      <Button
        className={cn(
          'group relative flex items-center min-w-30 cursor-pointer',
          className,
        )}
      >
        {totalAmount > 0 && (
          <>
            <b>{totalAmount} ₽</b>
            <span className='w-px h-4 mx-1 bg-gray-100' />
          </>
        )}
        <span className='flex items-center gap-1 transition duration-300 group-hover:opacity-0'>
          <ShoppingCart />
          <span>{totalItems}</span>
        </span>
        <ArrowRight className='absolute transition duration-300 -translate-x-2 opacity-0 right-5 group-hover:opacity-100 group-hover:translate-x-0' />
      </Button>
    </CartDrawer>
  );
}
