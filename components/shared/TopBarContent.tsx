import { Suspense } from 'react';
import { Container } from './Container';
import { SortPopup } from '../filters/SortPopup';

import { Categories } from '../categories/Categories';
import { getCategoryList } from '@/server';
import { CategoriesSkeleton } from '../skeletons';

async function CategoriesList() {
  const categories = await getCategoryList();
  return <Categories categories={categories} />;
}

export function TopBarContent() {
  return (
    <div className='sticky top-0 z-20 bg-white shadow-lg shadow-black/5'>
      <Container className='flex items-center justify-between gap-5 py-3'>
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesList />
        </Suspense>
        <Suspense>
          <SortPopup />
        </Suspense>
      </Container>
    </div>
  );
}
