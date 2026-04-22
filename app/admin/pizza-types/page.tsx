import { Suspense } from 'react';
import { PizzaTypes } from '@/components/admin';
import { getPizzaTypes } from '@/server';

type SearchParams = Promise<{ search?: string; page?: string; limit?: string }>;

async function PizzaTypesLoader({ searchParams }: { searchParams: SearchParams }) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getPizzaTypes(search, Number(page), Number(limit));
  return <PizzaTypes dataPromise={dataPromise} />;
}

export default function PizzaTypesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <PizzaTypesLoader searchParams={searchParams} />
    </Suspense>
  );
}
