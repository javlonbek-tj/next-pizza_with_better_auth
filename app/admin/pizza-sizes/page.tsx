import { Suspense } from 'react';
import { PizzaSizes } from '@/components/admin';
import { getPizzaSizes } from '@/server';

type SearchParams = Promise<{ search?: string; page?: string; limit?: string }>;

async function PizzaSizesLoader({ searchParams }: { searchParams: SearchParams }) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getPizzaSizes(search, Number(page), Number(limit));
  return <PizzaSizes dataPromise={dataPromise} />;
}

export default function PizzaSizesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <PizzaSizesLoader searchParams={searchParams} />
    </Suspense>
  );
}
