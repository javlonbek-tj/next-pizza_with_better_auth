import { CategoriesTable } from '@/components/admin';

export default function CategoriesPage() {
  return (
    <div className='space-y-6'>
      <h1 className='font-bold text-3xl'>Категории</h1>
      <CategoriesTable />
    </div>
  );
}
