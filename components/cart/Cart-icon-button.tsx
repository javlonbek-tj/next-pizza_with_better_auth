'use client';

import { Minus, Plus } from 'lucide-react';
import { useUpdateCartQuantity } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

interface Props {
  type: 'minus' | 'plus';
  quantity: number;
  cartItemId: string;
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
    'relative p-2.5 border-2 border-primary rounded-md transition-none cursor-pointer',
    isDisabled && 'opacity-60'
  );

  const iconClassName = cn(
    'top-1/2 left-1/2 absolute size-3 text-primary -translate-x-1/2 -translate-y-1/2',
    isDisabled && 'opacity-60'
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
