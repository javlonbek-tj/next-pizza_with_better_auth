import { Suspense } from 'react';
import { Categories } from '@/components/admin';
import { getCategoriesTableData } from '@/server/data/categories';
import { AdminTableSkeleton } from '@/components/skeletons';

type SearchParams = Promise<{ search?: string; page?: string; limit?: string }>;

async function CategoriesLoader({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getCategoriesTableData(
    search,
    Number(page),
    Number(limit)
  );
  return <Categories dataPromise={dataPromise} />;
}

export default function CategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<AdminTableSkeleton cols={5} />}>
      <CategoriesLoader searchParams={searchParams} />
    </Suspense>
  );
}
