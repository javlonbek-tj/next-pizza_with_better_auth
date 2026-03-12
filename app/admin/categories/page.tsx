import { Categories } from '@/components/admin';
import { getCategories } from '@/server/data/categories';
import { connection } from 'next/server';

export default async function CategoriesPage({
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

  const { data, total } = await getCategories(
    search,
    Number(page),
    Number(limit),
  );

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Категории</h1>
      <Categories categories={data} totalCount={total} />
    </div>
  );
}
