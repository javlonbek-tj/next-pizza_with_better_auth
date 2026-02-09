'use client';

import { cn } from '@/lib/utils';
import {
  CheckoutAddress,
  CheckoutCartItems,
  CheckoutPersonalInfo,
} from './index';
import { CartItemModel } from '@/types';

interface Props {
  className?: string;
  cartItems: CartItemModel[];
  isProcessing?: boolean;
}

export function CheckoutDetails({ className, cartItems, isProcessing }: Props) {
  return (
    <div className={cn('flex flex-col gap-6 basis-2/3', className)}>
      <CheckoutCartItems cartItems={cartItems} isProcessing={isProcessing} />

      <div
        className={cn(
          'transition-opacity duration-200',
          isProcessing && 'pointer-events-none opacity-90'
        )}
      >
        <CheckoutPersonalInfo />
      </div>

      <div
        className={cn(
          'transition-opacity duration-200',
          isProcessing && 'pointer-events-none opacity-90'
        )}
      >
        <CheckoutAddress />
      </div>
    </div>
  );
}
