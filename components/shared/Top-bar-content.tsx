import { GetSearchParams } from '@/lib/product/find-pizzas';
import { Container } from './Container';

import { SortPopup } from '../filters/Sort-popup';
import { Suspense } from 'react';
import { CategoriesSkeleton } from '../skeletons';
import { CategoriesLoader } from '../categories/Categories-loader';

interface TopBarContentProps {
  searchParams: GetSearchParams;
}

export async function TopBarContent({ searchParams }: TopBarContentProps) {
  return (
    <div className='top-0 z-10 sticky bg-white shadow-black/5 shadow-lg py-5'>
      <Container className='flex justify-between items-center gap-5'>
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesLoader searchParams={searchParams} />
        </Suspense>
        <SortPopup />
      </Container>
    </div>
  );
}
