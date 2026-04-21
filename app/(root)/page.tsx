import { Suspense } from 'react';

import { GetSearchParams } from '@/server/data/products';
import { Container } from '@/components/shared';
import { TopBarContent } from '@/components/shared/server';
import { FiltersContent } from '@/components/filters/server';
import {
  FiltersSkeleton,
  ProductsSkeleton,
  StoriesSkeleton,
} from '@/components/skeletons';
import { ProductsContent } from '@/components/product/server';
import { Stories } from '@/components/shared/Stories';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  return (
    <div className='flex-1'>
      <TopBarContent />
      <Suspense fallback={<StoriesSkeleton />}>
        <Stories />
      </Suspense>
      <Container className='flex gap-16 mt-5'>
        <aside className='w-3xs shrink-0'>
          <div className='sticky top-20'>
            <Suspense fallback={<FiltersSkeleton />}>
              <FiltersContent />
            </Suspense>
          </div>
        </aside>
        <main className='flex-1 min-w-0 space-y-12 pb-14'>
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsWithParams searchParams={searchParams} />
          </Suspense>
        </main>
      </Container>
    </div>
  );
}

async function ProductsWithParams({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense
      key={JSON.stringify(resolvedSearchParams)}
      fallback={<ProductsSkeleton />}
    >
      <ProductsContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
