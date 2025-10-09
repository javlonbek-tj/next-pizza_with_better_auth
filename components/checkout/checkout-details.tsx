import { cn } from '@/lib/utils';
import { CheckoutCard } from './checkout-card';
import { Trash2 } from 'lucide-react';

interface Props {
  className?: string;
}

export function CheckoutDetails({ className }: Props) {
  return (
    <div className={cn('flex flex-1 flex-col gap-6', className)}>
      <CheckoutCard
        title='1. Корзина'
        endAdornment={
          <div className='flex gap-2 items-center cursor-pointer text-gray-500'>
            <Trash2 className='w-4 h-4' /> <span>Удалить корзину</span>
          </div>
        }
      >
        123
      </CheckoutCard>
      <CheckoutCard
        title='1. Корзина'
        endAdornment={
          <div className='flex gap-2 items-center cursor-pointer text-gray-500'>
            <Trash2 className='w-4 h-4' /> <span>Удалить корзину</span>
          </div>
        }
      >
        123
      </CheckoutCard>
      <CheckoutCard
        title='1. Корзина'
        endAdornment={
          <div className='flex gap-2 items-center cursor-pointer text-gray-500'>
            <Trash2 className='w-4 h-4' /> <span>Удалить корзину</span>
          </div>
        }
      >
        123
      </CheckoutCard>
    </div>
  );
}
