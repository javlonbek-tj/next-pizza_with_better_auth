import { ProductsTable } from '@/components/admin/products/ProductsTable';

export default function ProductsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-bold text-3xl'>Продукты</h1>
        <p className='text-muted-foreground mt-2'>
          Управление продуктами и их вариантами
        </p>
      </div>
      <ProductsTable />
    </div>
  );
}
