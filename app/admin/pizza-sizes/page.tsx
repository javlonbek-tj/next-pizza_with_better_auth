import { PizzaSizes } from '@/components/admin';
import { getPizzaSizes } from '@/server';

export default async function PizzaSizesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const { search = '', page = '1', limit = '10' } = await searchParams;

  const dataPromise = getPizzaSizes(search, Number(page), Number(limit));

  return <PizzaSizes dataPromise={dataPromise} />;
}
