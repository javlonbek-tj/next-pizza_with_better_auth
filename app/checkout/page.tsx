'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Riple } from 'react-loading-indicators';

import { checkoutSchema, CheckoutValues } from '@/components/checkout';
import { CheckoutDetails } from '@/components/checkout/checkout-details';
import { CheckoutTotal } from '@/components/checkout/checkout-total';
import { BackButton, Container, Title } from '@/components/shared';
import { useCart } from '@/hooks';
import { cn } from '@/lib';
import { useCheckoutState } from '@/store/checkout-state';

export default function CheckoutPage() {
  const { data: cartItems = [], isPending } = useCart();
  const { isProcessing } = useCheckoutState();
  const router = useRouter();

  const isLoading = isPending || isProcessing;

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

  const onSubmit = (data: CheckoutValues) => {
    console.log(data);
  };

  if (isPending) {
    return (
      <Container className="mt-10 pb-10">
        <Title text="Оформление заказа" size="md" className="mb-2 font-bold" />
        <div className="mt-10 text-center">
          <Riple color="#32cd32" size="large" />
        </div>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="mt-10 pb-10">
        <Title text="Оформление заказа" size="md" className="mb-2 font-bold" />
        <div className="flex flex-col items-center gap-6 bg-yellow-50 mt-6 p-6 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-center">
            Ваша корзина пуста. Добавьте товары перед оформлением заказа.
          </p>
          <BackButton onClick={() => router.back()} />
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-10 pb-10">
      <Title text="Оформление заказа" size="md" className="mb-2 font-bold" />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'flex gap-6 mt-6 transition-opacity duration-200',
            isLoading && 'opacity-60'
          )}
        >
          <CheckoutDetails cartItems={cartItems} isProcessing={isProcessing} />
          <CheckoutTotal cartItems={cartItems} isProcessing={isProcessing} />
        </form>
      </FormProvider>
    </Container>
  );
}
