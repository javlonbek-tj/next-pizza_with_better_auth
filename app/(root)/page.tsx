import { Suspense } from 'react';

import { GetSearchParams } from '@/server/data/products';
import { Container } from '@/components/shared';
import { TopBarContent } from '@/components/shared/server';
import { FiltersContent } from '@/components/filters/server';
import { FiltersSkeleton, ProductsSkeleton } from '@/components/skeletons';
import { ProductsContent } from '@/components/product/server';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <TopBarContent />
      <Container className="flex gap-16 mt-10 pb-14">
        <aside className="w-3xs">
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersContent />
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
