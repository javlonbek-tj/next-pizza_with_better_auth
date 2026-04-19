import { Suspense } from 'react';
import { Categories } from '@/components/admin';
import { getCategoriesTableData } from '@/server/data/categories';

async function CategoriesContent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getCategoriesTableData(search, Number(page), Number(limit));
  return <Categories dataPromise={dataPromise} />;
}

export default function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  return (
    <Suspense>
      <CategoriesContent searchParams={searchParams} />
    </Suspense>
  );
}
