import { cn } from '@/lib/utils';
import { CheckoutCard } from './checkout-card';
import { Trash2 } from 'lucide-react';
import { CheckoutCartItems, CheckoutPersonalInfo } from './index';

interface Props {
  className?: string;
}

export function CheckoutDetails({ className }: Props) {
  return (
    <div className={cn('flex flex-col gap-6 basis-2/3', className)}>
      <CheckoutCard
        title="1. Корзина"
        endAdornment={
          <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
            <Trash2 className="w-4 h-4" /> <span>Удалить корзину</span>
          </div>
        }
      >
        <CheckoutCartItems />
      </CheckoutCard>
      <CheckoutCard title="2. Персональные данные">
        <CheckoutPersonalInfo />
      </CheckoutCard>
      <CheckoutCard
        title="1. Корзина"
        endAdornment={
          <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
            <Trash2 className="w-4 h-4" /> <span>Удалить корзину</span>
          </div>
        }
      >
        123
      </CheckoutCard>
    </div>
  );
}
