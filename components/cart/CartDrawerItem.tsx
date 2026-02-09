import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { CartItemInfo, CartUpdateButtons } from './index';
import { RemoveCartItem } from './RemoveCartItem';


interface Props {
  className?: string;
  id: string;
  imageUrl: string;
  name: string;
  quantity: number;
  totalCartItemPrice: number;
  details: string;
}

export function CartDrawerItem({
  className,
  id,
  imageUrl,
  name,
  quantity,
  totalCartItemPrice,
  details,
}: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 bg-white px-4 py-3',
        className
      )}
    >
      <Image src={imageUrl} alt={name} width={60} height={60} />
      <div className='flex flex-col flex-1 gap-2'>
        <CartItemInfo name={name} details={details} />
        <hr />
        <div className='flex justify-between items-center'>
          {/* Quantity controls */}
          <CartUpdateButtons id={id} quantity={quantity} />

          {/* Price + Remove */}
          <div className='flex items-center gap-4'>
            <span className='font-bold text-sm'>{totalCartItemPrice} ₽</span>
            <RemoveCartItem id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
