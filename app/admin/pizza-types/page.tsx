import { PizzaTypeTable } from '@/components/admin';
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

  const { data, total } = await getPizzaTypes(
    search,
    Number(page),
    Number(limit),
  );

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Типы пицц</h1>
      <PizzaTypeTable data={data} totalCount={total} />
    </div>
  );
}
