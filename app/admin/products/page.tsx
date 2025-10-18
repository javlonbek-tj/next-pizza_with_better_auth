// app/admin/products/page.tsx
import { ProductsTable } from '@/components/admin/products/ProductsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <Button asChild>
          <Link href='/admin/products/new'>
            <Plus className='w-4 h-4 mr-2' />
            Add Product
          </Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
}
