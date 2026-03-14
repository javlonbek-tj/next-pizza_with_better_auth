import { Categories } from '@/components/admin';
import { getCategoriesTableData } from '@/server/data/categories';
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

  const dataPromise = getCategoriesTableData(
    search,
    Number(page),
    Number(limit),
  );

  return <Categories dataPromise={dataPromise} />;
}
