import LoadingPage from '@/app/loading';
import { CategoriesTable } from '@/components/admin';
import { getCategories } from '@/server/data/categories';
import { Suspense } from 'react';

export default async function CategoriesPage() {
  const data = await getCategories();
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Категории</h1>
      <Suspense fallback={<LoadingPage />}>
        <CategoriesTable data={data} />
      </Suspense>
    </div>
  );
}
