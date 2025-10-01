import { findPizzas } from '@/lib/product';
import { ProductGroupList } from './Product-group-list';
import { GetSearchParams } from '@/lib/product/find-pizzas';
import { ProductNotFound } from './Product-not-found';

interface Props {
  searchParams: GetSearchParams;
}

export async function ProductsContent({ searchParams }: Props) {
  const categories = await findPizzas(searchParams);

  const hasProducts = categories.some((c) => c.products.length > 0);

  if (!hasProducts) return <ProductNotFound />;

  return (
    <>
      {categories.map(
        (category) =>
          category.products.length > 0 && (
            <ProductGroupList
              key={category.id}
              categoryTitle={category.name}
              categoryId={category.id}
              products={category.products}
            />
          )
      )}
    </>
  );
}
