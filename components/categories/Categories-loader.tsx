import { findPizzas, GetSearchParams } from '@/lib/product/find-pizzas';
import { Categories } from './Categories';

export async function CategoriesLoader({
  searchParams,
}: {
  searchParams: GetSearchParams;
}) {
  const categories = await findPizzas(searchParams);
  return <Categories categories={categories} />;
}
