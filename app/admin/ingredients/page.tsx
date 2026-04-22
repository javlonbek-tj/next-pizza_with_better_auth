import { Suspense } from 'react';
import { Ingredients } from '@/components/admin';
import { getIngredients } from '@/server';
import { AdminTableSkeleton } from '@/components/skeletons';

type SearchParams = Promise<{ search?: string; page?: string; limit?: string }>;

async function IngredientsLoader({ searchParams }: { searchParams: SearchParams }) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getIngredients(search, Number(page), Number(limit));
  return <Ingredients dataPromise={dataPromise} />;
}

export default function IngredientsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<AdminTableSkeleton cols={5} />}>
      <IngredientsLoader searchParams={searchParams} />
    </Suspense>
  );
}
