import { findPizzas, GetSearchParams } from '@/server/data/find-pizzas';
import { ProductGroupList } from './ProductGroupList';
import { ProductNotFound } from './ProductNotFound';

interface Props {
  searchParams: GetSearchParams;
}

export async function ProductsContent({ searchParams }: Props) {
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
