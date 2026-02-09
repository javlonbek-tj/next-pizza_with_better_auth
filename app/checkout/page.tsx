'use client';

import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { createOrder } from '@/app/actions';
import { useIsMutating } from '@tanstack/react-query';
import { queryKeys } from '@/lib/constants';
import { useCart } from '@/hooks';
import { checkoutSchema, CheckoutValues, EmptyCart } from '@/components/checkout';
import { CheckoutDetails, CheckoutTotal } from '@/components/checkout';
import { Container, Title } from '@/components/shared';
import { cn } from '@/lib';
import { useCheckoutState } from '@/store/checkout-state';

export default function CheckoutPage() {
  const { data: cartItems = [], isPending: isCartPending } = useCart();
  const { isProcessing, setIsProcessing } = useCheckoutState();
  const isMutating = useIsMutating({ mutationKey: queryKeys.cart }) > 0;
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
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CheckoutValues) => {
    try {
      setIsSubmitting(true);
      const order = await createOrder(data);

      toast.success('Заказ успешно оформлен! 🍕');
      router.push('/checkout/success?id=' + order.id);
    } catch (error) {
      console.error(error);
      toast.error('Не удалось создать заказ');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsProcessing(isSubmitting || isMutating);
  }, [isSubmitting, isMutating, setIsProcessing]);

  if (!isCartPending && cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Container className='mt-10 pb-10'>
      <Title text='Оформление заказа' size='md' className='mb-2 font-bold' />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'flex gap-6 mt-6 transition-opacity duration-200',
            isProcessing && 'opacity-60 pointer-events-none'
          )}
        >
          <CheckoutDetails cartItems={cartItems} isProcessing={isProcessing} />
          <CheckoutTotal cartItems={cartItems} isProcessing={isProcessing} />
        </form>
      </FormProvider>
    </Container>
  );
}