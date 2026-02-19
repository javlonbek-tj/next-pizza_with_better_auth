import LoadingPage from '@/app/loading';
import { PizzaTypeTable } from '@/components/admin';
import { getPizzaTypes } from '@/server';
import { Suspense } from 'react';

export default async function CategoriesPage() {
  /*  const session = await auth();
  if (!session?.user?.isAdmin) {
    // Assuming user has isAdmin field
    redirect('/'); // Or to login
  } */

  const data = await getPizzaTypes();
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Типы пицц</h1>
      <Suspense fallback={<LoadingPage />}>
        <PizzaTypeTable data={data} />
      </Suspense>
    </div>
  );
}
