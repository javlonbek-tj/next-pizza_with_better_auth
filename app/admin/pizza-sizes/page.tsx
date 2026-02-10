import { PizzaSizeTable } from '@/components/admin';
import { getPizzaSizes } from '@/server';


export default async function CategoriesPage() {
   /*  const session = await auth();
  if (!session?.user?.isAdmin) {
    // Assuming user has isAdmin field
    redirect('/'); // Or to login
  } */

    const data = await getPizzaSizes();
  return (
    <div className='space-y-6'>
      <h1 className='font-bold text-3xl'>Размеры</h1>
      <PizzaSizeTable data={data} />
    </div>
  );
}
