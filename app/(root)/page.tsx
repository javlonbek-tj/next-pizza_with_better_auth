import { Suspense } from 'react';
import { GetSearchParams } from '@/lib/product/find-pizzas';
import { Container, Title, TopBarContent } from '@/components/shared';
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
      <Container className='mt-10'>
        <Title text='Все пиццы' size='lg' className='font-extrabold' />
      </Container>
      <TopBarContent />
      <Container className='flex gap-16 mt-10 pb-14'>
        <aside className='w-[250px] sticky top-24 self-start'>
          <Filters />
        </aside>
        <div className='flex-1 min-w-0'>
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
