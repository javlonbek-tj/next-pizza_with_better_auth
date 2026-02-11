import { IngredientsTable } from '@/components/admin';
import { getIngredients } from '@/server';

export default async function IngredientsPage() {
  const data = await getIngredients();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Ингредиенты</h1>
      <IngredientsTable data={data} />
    </div>
  );
}
