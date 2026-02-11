import { PizzaTypeTable } from '@/components/admin';
import { getPizzaTypes } from '@/server';

export default async function CategoriesPage() {
  /*  const session = await auth();
  if (!session?.user?.isAdmin) {
    // Assuming user has isAdmin field
    redirect('/'); // Or to login
  } */

  const data = await getPizzaTypes();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Типы пицц</h1>
      <PizzaTypeTable data={data} />
    </div>
  );
}
