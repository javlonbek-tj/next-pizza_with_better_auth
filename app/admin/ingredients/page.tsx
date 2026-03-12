import { Ingredients } from '@/components/admin';
import { getIngredients } from '@/server';
import { connection } from 'next/server';

export default async function IngredientsPage({
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

  const { data, total } = await getIngredients(
    search,
    Number(page),
    Number(limit),
  );

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Ингредиенты</h1>
      <Ingredients ingredients={data} totalCount={total} />
    </div>
  );
}
