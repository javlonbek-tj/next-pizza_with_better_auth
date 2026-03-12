import { PizzaSizeTable } from '@/components/admin';
import { getPizzaSizes } from '@/server';
import { connection } from 'next/server';

export default async function PizzaSizesPage({
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

  const { data, total } = await getPizzaSizes(
    search,
    Number(page),
    Number(limit),
  );

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Размеры</h1>
      <PizzaSizeTable data={data} totalCount={total} />
    </div>
  );
}
