'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Title } from '../shared';

interface Props {
  className?: string;
  error?: string;
}

export function InvalidPizzaItems({ className, error }: Props) {
  const router = useRouter();
  return (
    <div
      className={cn(
        'flex justify-center items-center min-h-[500px]',
        className
      )}
    >
      <div className='p-8 text-center'>
        <Title text='Продукт недоступен' size='md' className='text-red-600' />
        <p className='mt-2 text-gray-500'>{error}</p>
        <p className='mt-4 text-gray-400 text-sm'>
          Обратитесь к администратору для исправления конфигурации товара
        </p>
        <Button
          onClick={() => router.back()}
          variant='outline'
          className='mt-4 cursor-pointer'
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
}
