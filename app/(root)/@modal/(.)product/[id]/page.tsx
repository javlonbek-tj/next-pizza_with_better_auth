import { ProductForm } from '@/components/product';
import { getProductById } from '@/server/data/products';
import { getPizzaSizes, getPizzaTypes } from '@/server/data/pizza-options';
import { ChooseProductModal } from '@/components/modals';

export default async function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const pizzaSizes = await getPizzaSizes();
  const pizzaTypes = await getPizzaTypes();

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
