import { findPizzas } from '@/lib/product';
import { ProductGroupList } from './ProductGroupList';
import { GetSearchParams } from '@/lib/product/find-pizzas';
import { ProductNotFound } from './ProductNotFound';
import { sleep } from '@/lib';

interface Props {
  searchParams: GetSearchParams;
}

export async function ProductsContent({ searchParams }: Props) {
  await sleep(2000);
  const categories = await findPizzas(searchParams);

  const hasProducts = categories.some(
    (category) => category.products.length > 0
  );

  if (!hasProducts) return <ProductNotFound />;

  return (
    <>
      {categories.map(
        (category) =>
          category.products.length > 0 && (
            <ProductGroupList
              key={category.id}
              categoryTitle={category.name}
              categorySlug={category.slug}
              products={category.products}
            />
          )
      )}
    </>
  );
}
