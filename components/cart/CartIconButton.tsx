'use client';

import { Minus, Plus } from 'lucide-react';
import { useUpdateCartQuantity } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

interface Props {
  type: 'minus' | 'plus';
  quantity: number;
  cartItemId: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CartIconButton({
  type,
  quantity,
  cartItemId,
  size = 'sm',
}: Props) {
  const { mutate: updateQuantity} = useUpdateCartQuantity();

  const handleClick = () => {
    const newQty = type === 'plus' ? quantity + 1 : quantity - 1;
    if (newQty < 1) return;
    updateQuantity({ id: cartItemId, quantity: newQty });
  };

  const isDisabled = (type === 'minus' && quantity <= 1);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-8 h-8 text-sm',
  }[size];

  const iconSize = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  }[size];

  const buttonClassName = cn(
    'relative flex justify-center items-center border-2 border-primary rounded-md transition-none cursor-pointer',
    sizeClasses,
    isDisabled && 'opacity-60 border-primary/50 cursor-not-allowed'
  );

  const iconClassName = cn(
    'text-primary',
    iconSize,
    isDisabled && 'opacity-60 text-primary/50'
  );

  return (
    <button
      className={buttonClassName}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={type === 'plus' ? 'Increase quantity' : 'Decrease quantity'}
      type="button"
    >
      {type === 'minus' && <Minus className={iconClassName} />}
      {type === 'plus' && <Plus className={iconClassName} />}
    </button>
  );
}
