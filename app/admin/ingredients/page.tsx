import { Ingredients } from '@/components/admin';
import { getIngredients } from '@/server';

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getIngredients(search, Number(page), Number(limit));
  return <Ingredients dataPromise={dataPromise} />;
}
