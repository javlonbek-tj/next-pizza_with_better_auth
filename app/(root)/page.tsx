import { Suspense } from 'react';

import { GetSearchParams } from '@/server/data/products';
import { Container, TopBarContent } from '@/components/shared';
import { ProductsSkeleton } from '@/components/skeletons';
import { Filters } from '@/components/filters';
import { ProductsContent } from '@/components/product';

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
        <aside className="w-[250px]">
          <Filters />
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
