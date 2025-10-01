'use client';

import { Minus, Plus } from 'lucide-react';
import { useUpdateCartQuantity } from '../hooks/use-cart';
import { cn } from '@/lib/utils';

interface Props {
  type: 'minus' | 'plus';
  quantity: number;
  cartItemId: number;
}

export function CartIconButton({ type, quantity, cartItemId }: Props) {
  const { mutate: updateQuantity, isPending } = useUpdateCartQuantity();

  const handleClick = () => {
    const newQty = type === 'plus' ? quantity + 1 : quantity - 1;
    if (newQty < 1) return;

    updateQuantity({ id: cartItemId, quantity: newQty });
  };

  const isDisabled = isPending || (type === 'minus' && quantity <= 1);

  const buttonClassName = cn(
    'group relative p-2.5 border-2 border-primary rounded-md transition-colors duration-200 ease-in-out cursor-pointer',
    'hover:bg-primary disabled:opacity-50 disabled:pointer-events-none disabled:border-gray-300',
    isDisabled &&
      'bg-gray-100 border-gray-300 hover:bg-gray-100 hover:border-gray-300'
  );

  const iconClassName = cn(
    'top-1/2 left-1/2 absolute size-3 -translate-x-1/2 -translate-y-1/2',
    'text-primary transition-colors duration-200 ease-in-out group-hover:text-white',
    isDisabled && 'text-gray-400 group-hover:text-gray-400'
  );

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={type === 'plus' ? 'Increase quantity' : 'Decrease quantity'}
    >
      {type === 'minus' && <Minus className={iconClassName} />}
      {type === 'plus' && <Plus className={iconClassName} />}
    </button>
  );
}
