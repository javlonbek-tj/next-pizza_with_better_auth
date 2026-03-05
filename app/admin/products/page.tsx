import { Products } from '@/components/admin';
import { Spinner } from '@/components/shared';
import {
  getAllProducts,
  getCategories,
  getIngredients,
  getPizzaSizes,
  getPizzaTypes,
} from '@/server';
import { Suspense } from 'react';

async function ProductsList() {
  const products = await getAllProducts();
  const categories = await getCategories();
  const ingredients = await getIngredients();
  const sizes = await getPizzaSizes();
  const types = await getPizzaTypes();

  return (
    <Products
      products={products}
      categories={categories}
      ingredients={ingredients}
      sizes={sizes}
      types={types}
    />
  );
}

export default async function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl">Продукты</h1>
        <p className="mt-2 text-muted-foreground">
          Управление продуктами и их вариантами
        </p>
      </div>
      <Suspense fallback={<Spinner />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}
