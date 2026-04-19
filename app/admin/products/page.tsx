import { Suspense } from 'react';
import {
  getProductTableData,
  getCategoryList,
  getIngredientList,
  getPizzaSizesList,
  getPizzaTypesList,
} from '@/server';
import { Products } from '@/components/admin';

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const {
    search = '',
    categoryId = 'all',
    page = '1',
    limit = '10',
  } = await searchParams;

  const productsPromise = getProductTableData(search, categoryId, Number(page), Number(limit));
  const categoriesPromise = getCategoryList();
  const ingredientsPromise = getIngredientList();
  const sizesPromise = getPizzaSizesList();
  const typesPromise = getPizzaTypesList();

  return (
    <Products
      productsPromise={productsPromise}
      categoriesPromise={categoriesPromise}
      ingredientsPromise={ingredientsPromise}
      sizesPromise={sizesPromise}
      typesPromise={typesPromise}
    />
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  return (
    <Suspense>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}
