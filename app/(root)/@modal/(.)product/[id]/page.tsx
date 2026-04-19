import { Suspense } from 'react';
import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizesList, getPizzaTypesList } from '@/server';

async function ProductModalContent({
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
    <ProductForm
      product={product}
      isModal={true}
      pizzaSizes={pizzaSizes}
      pizzaTypes={pizzaTypes}
    />
  );
}

export default function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <ProductModalContent params={params} />
    </Suspense>
  );
}
