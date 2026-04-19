import { Suspense } from 'react';
import { PizzaTypes } from '@/components/admin';
import { getPizzaTypes } from '@/server';

async function PizzaTypesContent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getPizzaTypes(search, Number(page), Number(limit));
  return <PizzaTypes dataPromise={dataPromise} />;
}

export default function PizzaTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  return (
    <Suspense>
      <PizzaTypesContent searchParams={searchParams} />
    </Suspense>
  );
}
