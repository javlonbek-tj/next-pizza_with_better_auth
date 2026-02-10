import { Suspense } from 'react';

import { GetSearchParams } from '@/server/data/products';
import { Container, TopBarContent } from '@/components/shared';
import { CategoriesSkeleton, FiltersSkeleton, ProductsSkeleton } from '@/components/skeletons';
import { Filters } from '@/components/filters';
import { ProductsContent } from '@/components/product';
import { getCategories, getIngredients, getPizzaSizes, getPizzaTypes } from '@/server';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const ingredients = await getIngredients();
  const pizzaSizes = await getPizzaSizes();
  const pizzaTypes = await getPizzaTypes();
  const categories = await getCategories();

  return (
    <>
    <Suspense fallback={<CategoriesSkeleton />}>
      <TopBarContent categories={categories} />
    </Suspense>
      <Container className="flex gap-16 mt-10 pb-14">
        <aside className="w-[250px]">
          <Suspense fallback={<FiltersSkeleton />}>
            <Filters
              ingredients={ingredients}
              pizzaSizes={pizzaSizes}
              pizzaTypes={pizzaTypes}
            />
          </Suspense>
        </aside>
        <main className="flex-1 space-y-12 min-w-0">
          <Suspense
            key={JSON.stringify(resolvedSearchParams)}
            fallback={<ProductsSkeleton />}
          >
            <ProductsContent searchParams={resolvedSearchParams} />
          </Suspense>
        </main>
      </Container>
    </>
  );
}
