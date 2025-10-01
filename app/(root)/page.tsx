import { Suspense } from 'react';
import { Filters } from '@/components/filters/Filters';
import { ProductsContent } from '@/components/product';
import { Container } from '@/components/shared';
import { Title } from '@/components/shared';
import { TopBarContent } from '@/components/shared';
import { ProductsSkeleton } from '@/components/skeletons';

import { GetSearchParams } from '@/lib/product/find-pizzas';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <>
      <Container className='mt-10'>
        <Title text='Все пиццы' size='lg' className='font-extrabold' />
      </Container>

      <TopBarContent searchParams={resolvedSearchParams} />

      <Container className='flex gap-16 mt-10 pb-14'>
        <div className='w-[250px]'>
          <Filters />
        </div>
        <div className='flex flex-col flex-1 gap-16'>
          <Suspense
            key={JSON.stringify(resolvedSearchParams)}
            fallback={<ProductsSkeleton />}
          >
            <ProductsContent searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
