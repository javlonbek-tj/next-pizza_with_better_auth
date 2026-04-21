import { Container } from '@/components/shared';
import {
  CategoriesSkeleton,
  FiltersSkeleton,
  ProductsSkeleton,
  StoriesSkeleton,
} from '@/components/skeletons';

export default function Loading() {
  return (
    <div className='flex-1'>
      <div className='sticky top-0 z-20 bg-white shadow-lg shadow-black/5'>
        <Container className='flex items-center justify-between gap-5 py-3'>
          <CategoriesSkeleton />
          <div className='w-32 h-8 bg-gray-200 rounded-md animate-pulse' />
        </Container>
      </div>
      <StoriesSkeleton />
      <Container className='flex gap-16 mt-5'>
        <aside className='w-3xs shrink-0'>
          <div className='sticky top-20'>
            <FiltersSkeleton />
          </div>
        </aside>
        <main className='flex-1 min-w-0 space-y-12 pb-14'>
          <ProductsSkeleton />
        </main>
      </Container>
    </div>
  );
}
