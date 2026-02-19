import { Suspense } from 'react';
import { Products } from '@/components/admin';
import {
  getAllProducts,
  getCategories,
  getIngredients,
  getPizzaSizes,
  getPizzaTypes,
} from '@/server';
import LoadingPage from '@/app/loading';

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = await getCategories();
  const ingredients = await getIngredients();
  const sizes = await getPizzaSizes();
  const types = await getPizzaTypes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl">Продукты</h1>
        <p className="mt-2 text-muted-foreground">
          Управление продуктами и их вариантами
        </p>
      </div>
      <Suspense fallback={<LoadingPage />}>
        <Products
          products={products}
          categories={categories}
          ingredients={ingredients}
          sizes={sizes}
          types={types}
        />
      </Suspense>
    </div>
  );
}
