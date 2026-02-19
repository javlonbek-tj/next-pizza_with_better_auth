'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { useIsMutating } from '@tanstack/react-query';
import { useCart, useCreateOrder } from '@/hooks';
import { checkoutSchema, CheckoutValues } from '@/components/checkout';
import { CheckoutDetails, CheckoutTotal } from '@/components/checkout';
import { Container, Spinner, Title } from '@/components/shared';
import { cn } from '@/lib';
import { EmptyCart } from '@/components/cart';

export default function CheckoutPage() {
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

  const { mutateAsync: createOrder, isPending: isSubmitting } =
    useCreateOrder();

  const onSubmit = async (data: CheckoutValues) => {
    try {
      const order = await createOrder(data);

      toast.success('Заказ успешно оформлен! 🍕');
      router.push('/checkout/success?id=' + order.id);
    } catch (error) {
      console.error(error);
      toast.error('Не удалось создать заказ');
    }
  };

  const isProcessing = isSubmitting || isMutating;

  return (
    <Container className="mt-10 pb-10">
      <Title text="Оформление заказа" size="md" className="mb-2 font-bold" />

      {isCartPending ? (
        <Spinner className="mt-20" />
      ) : (
        <>
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                  'flex gap-6 mt-6 transition-opacity duration-200',
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
    </Container>
  );
}
