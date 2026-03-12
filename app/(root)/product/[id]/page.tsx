import { Container, BackButton } from '@/components/shared';
import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizes, getPizzaTypes } from '@/server';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const pizzaSizes = await getPizzaSizes();
  const pizzaTypes = await getPizzaTypes();

  return (
    <Container className="my-10">
      {product ? (
        <div className="p-0 h-125">
          <ProductForm
            product={product}
            isModal={false}
            pizzaSizes={pizzaSizes}
            pizzaTypes={pizzaTypes}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-gray-500 text-lg">Продукт не найден</p>
          <BackButton />
        </div>
      )}
    </Container>
  );
}
