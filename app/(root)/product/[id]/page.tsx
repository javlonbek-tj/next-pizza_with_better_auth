'use client';

import { Container, Spinner } from '@/components/shared';
import { ProductForm } from '@/components/product';
import { useGetPizzaSizes, useGetPizzaTypes, useGetProduct } from '@/hooks';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: product, isPending: isProductPending } = useGetProduct(
    params.id
  );
  const { data: pizzaSizes = [], isPending: isPizzaSizesPending } =
    useGetPizzaSizes();
  const { data: pizzaTypes = [], isPending: isPizzaTypesPending } =
    useGetPizzaTypes();

  const isPending =
    isProductPending || isPizzaSizesPending || isPizzaTypesPending;

  return (
    <Container className='my-10'>
      {isPending ? (
        <Spinner className='mt-36' />
      ) : (
        <div className='p-0 h-[600px]'>
          <ProductForm
            product={product}
            isModal={false}
            isPending={isPending}
            pizzaSizes={pizzaSizes}
            pizzaTypes={pizzaTypes}
          />
        </div>
      )}
    </Container>
  );
}
