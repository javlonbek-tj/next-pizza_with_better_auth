import { Container } from '@/components/shared';
import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizesList, getPizzaTypesList } from '@/server';

export default async function ProductPage({
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
      <div className='h-138'>
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
