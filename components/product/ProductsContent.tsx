import { getFilteredProducts, GetSearchParams } from '@/server/data/products';
import { ProductGroupList } from './ProductGroupList';
import { ProductNotFound } from './ProductNotFound';

interface Props {
  searchParams: GetSearchParams;
}

export async function ProductsContent({ searchParams }: Props) {
  const categories = await getFilteredProducts(searchParams);

  const hasProducts = categories.some(
    (category) => category.products.length > 0,
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
          ),
      )}
    </>
  );
}
