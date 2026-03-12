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
    <div className="flex-1">
      <TopBarContent />
      <Container className="flex gap-16 mt-5">
        <aside className="w-3xs shrink-0">
          <div className="sticky top-20">
            <Suspense fallback={<FiltersSkeleton />}>
              <FiltersContent />
            </Suspense>
          </div>
        </aside>
        <main className="flex-1 min-w-0 space-y-12 pb-14">
          <Suspense
            key={JSON.stringify(resolvedSearchParams)}
            fallback={<ProductsSkeleton />}
          >
            <ProductsContent searchParams={resolvedSearchParams} />
          </Suspense>
        </main>
      </Container>
    </div>
  );
}
