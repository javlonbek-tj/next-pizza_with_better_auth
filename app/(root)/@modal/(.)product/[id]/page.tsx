import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizesList, getPizzaTypesList } from '@/server';
import { ChooseProductModal } from '@/components/modals';

export default async function ProductModalPage({
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
    <ChooseProductModal>
      <ProductForm
        product={product}
        isModal={true}
        pizzaSizes={pizzaSizes}
        pizzaTypes={pizzaTypes}
      />
    </ChooseProductModal>
  );
}
