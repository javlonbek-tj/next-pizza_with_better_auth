'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useIsMutating } from '@tanstack/react-query';

import { useCart } from '@/hooks';
import { checkoutSchema, CheckoutValues } from '@/components/checkout';
import { CheckoutDetails, CheckoutTotal } from '@/components/checkout';
import { Container, Spinner, Title } from '@/components/shared';
import { cn } from '@/lib';
import { EmptyCart } from '@/components/cart';
import { createOrder } from '../actions';

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: cartItems = [], isPending: isCartPending } = useCart();
  const isMutating = useIsMutating({ mutationKey: ['cart', 'critical'] }) > 0;
  const router = useRouter();

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      comment: '',
      totalAmount: 0,
      totalCartPrice: 0,
      deliveryPrice: 0,
    },
  });

  const onSubmit = async (data: CheckoutValues) => {
    try {
      setIsSubmitting(true);
      const result = await createOrder(data);

      if (!result.success) {
        toast.error(result.message || 'Не удалось создать заказ');
        return;
      }

      toast.success('Заказ успешно оформлен! 🍕');
      router.push('/checkout/success?id=' + result.data?.id);
    } catch {
      toast.error('Не удалось создать заказ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || isMutating;

  return (
    <Container className='pb-10 mt-6'>
      <main>
        <Title text='Оформление заказа' className='font-bold' size='md' />

        {isCartPending ? (
          <Spinner className='mt-20' />
        ) : (
          <>
            {cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className={cn(
                    'flex gap-6 mt-4 transition-opacity duration-200',
                    isProcessing && 'opacity-90 pointer-events-none',
                  )}
                >
                  <CheckoutDetails
                    cartItems={cartItems}
                    isProcessing={isProcessing}
                  />
                  <CheckoutTotal
                    cartItems={cartItems}
                    isProcessing={isProcessing}
                  />
                </form>
              </FormProvider>
            )}
          </>
        )}
      </main>
    </Container>
  );
}
