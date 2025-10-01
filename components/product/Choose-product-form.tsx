import Image from 'next/image';
import { Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

import { Title } from '../shared';

interface Props {
  className?: string;
  imageUrl: string;
  name: string;
  price: number;
  onAddToCart: () => void;
  isPending: boolean;
  isModal: boolean;
}

export function ChooseProductForm({
  className,
  imageUrl,
  name,
  price,
  onAddToCart,
  isPending,
  isModal,
}: Props) {
  return (
    <div
      className={cn(
        'flex items-stretch',
        !isModal && 'max-w-4xl mx-auto',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-1 justify-center items-center',
          !isModal && 'rounded-2xl overflow-hidden bg-[#FFF7EE]'
        )}
      >
        <Image src={imageUrl} alt={name} width={300} height={300} />
      </div>
      <div
        className={cn(
          'flex-1 bg-[#f7f6f5] p-7 flex flex-col justify-between',
          !isModal && 'bg-white py-0'
        )}
      >
        <Title text={name} size='md' />
        <Button
          className={cn(
            'w-full cursor-pointer mt-5',
            isModal ? 'py-5 text-base' : 'py-3 text-sm max-w-xs mx-auto'
          )}
          disabled={isPending}
          onClick={onAddToCart}
        >
          {isPending ? (
            <Loader className='w-5 h-5 animate-spin' />
          ) : (
            `Добавить в корзину за ${price} ₽`
          )}
        </Button>
      </div>
    </div>
  );
}
