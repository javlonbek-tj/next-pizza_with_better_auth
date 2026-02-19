import LoadingPage from '@/app/loading';
import { IngredientsTable } from '@/components/admin';
import { getIngredients } from '@/server';
import { Suspense } from 'react';

export default async function IngredientsPage() {
  const data = await getIngredients();
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Ингредиенты</h1>
      <Suspense fallback={<LoadingPage />}>
        <IngredientsTable data={data} />
      </Suspense>
    </div>
  );
}
