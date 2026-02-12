import { CategoriesTable } from '@/components/admin';
import { getCategories } from '@/server/data/categories';

export default async function CategoriesPage() {
  const data = await getCategories();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Категории</h1>
      <CategoriesTable data={data} />
    </div>
  );
}
