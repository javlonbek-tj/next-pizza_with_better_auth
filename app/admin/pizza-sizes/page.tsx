import { PizzaSizeTable } from '@/components/admin';

export default function CategoriesPage() {
  return (
    <div className='space-y-6'>
      <h1 className='font-bold text-3xl'>Размеры</h1>
      <PizzaSizeTable />
    </div>
  );
}
