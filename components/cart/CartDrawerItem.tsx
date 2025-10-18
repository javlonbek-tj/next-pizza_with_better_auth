import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { CartItemInfo, CartUpdateButtons } from './index';
import { useRemoveCartItem } from '@/hooks';

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
  const { mutate: removeCartItem, isPending } = useRemoveCartItem();
  return (
    <div
      className={cn(
        'flex items-center gap-4 bg-white px-4 py-3',
        { 'opacity-50 pointer-events-none': isPending },
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
            <Trash2Icon
              className='text-red-500 cursor-pointer'
              size={16}
              onClick={() => !isPending && removeCartItem({ id })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
