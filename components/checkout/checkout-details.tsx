'use client';

import { cn } from '@/lib/utils';
import {
  CheckoutAddress,
  CheckoutCartItems,
  CheckoutPersonalInfo,
} from './index';

interface Props {
  className?: string;
}

export function CheckoutDetails({ className }: Props) {
  return (
    <div className={cn('flex flex-col gap-6 basis-2/3', className)}>
      <CheckoutCartItems />
      <CheckoutPersonalInfo />
      <CheckoutAddress />
    </div>
  );
}
