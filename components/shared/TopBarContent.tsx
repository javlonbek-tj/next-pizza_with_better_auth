import { Suspense } from 'react';
import { Container } from './Container';
import { SortPopup } from '../filters/SortPopup';

import { Categories } from '../categories/Categories';
import { getCategories } from '@/server';
import { CategoriesSkeleton } from '../skeletons';

async function CategoriesList() {
  const categories = await getCategories();
  return <Categories categories={categories} />;
}

export function TopBarContent() {
  return (
    <div className="top-0 z-20 sticky bg-white shadow-black/5 shadow-lg">
      <Container className="flex justify-between items-center gap-5 py-5">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesList />
        </Suspense>
        <SortPopup />
      </Container>
    </div>
  );
}
