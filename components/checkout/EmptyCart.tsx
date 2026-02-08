'use client';

import { useRouter } from 'next/navigation';
import { BackButton, Container, Title } from '@/components/shared';

export function EmptyCart() {
  const router = useRouter();

  return (
    <Container className='mt-10 pb-10'>
      <Title text='Оформление заказа' size='md' className='mb-2 font-bold' />
      <div className='flex flex-col items-center gap-6 bg-yellow-50 mt-6 p-6 border border-yellow-200 rounded-lg'>
        <p className='text-yellow-800 text-center'>
          Ваша корзина пуста. Добавьте товары перед оформлением заказа.
        </p>
        <BackButton onClick={() => router.back()} />
      </div>
    </Container>
  );
}
