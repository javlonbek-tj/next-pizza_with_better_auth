// app/admin/products/page.tsx
import { ProductsTable } from '@/components/admin/products/ProductsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Товары</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 w-4 h-4" />
            Добавить товар
          </Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
}
