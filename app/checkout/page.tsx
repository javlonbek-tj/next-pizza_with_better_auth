'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutValues } from '@/components/checkout';
import { CheckoutDetails } from '@/components/checkout/checkout-details';
import { CheckoutTotal } from '@/components/checkout/checkout-total';
import { Container, Title } from '@/components/shared';

export default function CheckoutPage() {
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

  const onSubmit = (data: CheckoutValues) => console.log(data);
  return (
    <Container className='mt-10 pb-10'>
      <Title text='Оформление заказа' size='md' className='font-bold' />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex gap-6 mt-6'
        >
          <CheckoutDetails />
          <CheckoutTotal />
        </form>
      </FormProvider>
    </Container>
  );
}
