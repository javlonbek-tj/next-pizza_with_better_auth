import { Products } from '@/components/admin/products/Products';

export default function ProductsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Продукты</h1>
        <p className='mt-2 text-muted-foreground'>
          Управление продуктами и их вариантами
        </p>
      </div>
      <Products />
    </div>
  );
}
