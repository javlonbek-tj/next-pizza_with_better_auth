import { Suspense } from 'react';
import { Container } from '@/components/shared';
import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizesList, getPizzaTypesList } from '@/server';

async function ProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, pizzaSizes, pizzaTypes] = await Promise.all([
    getProductById(id),
    getPizzaSizesList(),
    getPizzaTypesList(),
  ]);

  return (
    <Container className='my-10'>
      <div className='min-h-80 md:h-138'>
        <ProductForm
          product={product}
          isModal={false}
          pizzaSizes={pizzaSizes}
          pizzaTypes={pizzaTypes}
        />
      </div>
    </Container>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <ProductContent params={params} />
    </Suspense>
  );
}
