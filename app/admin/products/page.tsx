import { Suspense } from 'react';
import {
  getProductTableData,
  getCategoryList,
  getIngredientList,
  getPizzaSizesList,
  getPizzaTypesList,
} from '@/server';
import { Products } from '@/components/admin';

type SearchParams = Promise<{
  search?: string;
  categoryId?: string;
  page?: string;
  limit?: string;
}>;

async function ProductsLoader({ searchParams }: { searchParams: SearchParams }) {
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

export default function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <ProductsLoader searchParams={searchParams} />
    </Suspense>
  );
}
