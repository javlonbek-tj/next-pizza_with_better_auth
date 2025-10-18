// app/admin/categories/page.tsx
import { CategoriesTable } from '@/components/admin/categories/CategoriesTable';

export default function CategoriesPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Categories</h1>
      </div>
      <CategoriesTable />
    </div>
  );
}
