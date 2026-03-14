import { PizzaTypes } from '@/components/admin';
import { getPizzaTypes } from '@/server';
import { connection } from 'next/server';

export default async function PizzaTypesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  await connection();
  const { search = '', page = '1', limit = '10' } = await searchParams;

  const dataPromise = getPizzaTypes(search, Number(page), Number(limit));

  return <PizzaTypes dataPromise={dataPromise} />;
}
