'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Title, BackButton } from '@/components/shared';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const router = useRouter();

  return (
    <Container className='mt-10 pb-10'>
      <div className='flex flex-col items-center gap-6 bg-white p-10 border border-gray-100 rounded-2xl shadow-sm'>
        <div className='flex justify-center items-center bg-green-50 rounded-full w-20 h-20'>
          <span className='text-4xl'>🎉</span>
        </div>
        
        <Title text='Заказ успешно оформлен!' size='md' className='font-bold' />
        
        <div className='text-center'>
          <p className='text-gray-500'>
            Ваш заказ <span className='font-bold text-primary'>#{orderId?.slice(0, 8)}</span> принят в обработку.
          </p>
          <p className='mt-2 text-gray-500'>
            Мы свяжемся с вами в ближайшее время для подтверждения заказа.
          </p>
        </div>

        <BackButton onClick={() => router.push('/')} text='На главную' />
      </div>
    </Container>
  );
}
