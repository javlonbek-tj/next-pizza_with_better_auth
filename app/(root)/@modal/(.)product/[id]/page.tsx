import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizes, getPizzaTypes } from '@/server/data/pizza-options';

export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const pizzaSizes = await getPizzaSizes();
  const pizzaTypes = await getPizzaTypes();

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 min-h-[500px]">
        <p className="text-gray-500 text-lg">Продукт не найден</p>
      </div>
    );
  }

  return (
    <ProductForm
      product={product}
      isModal={true}
      pizzaSizes={pizzaSizes}
      pizzaTypes={pizzaTypes}
    />
  );
}
