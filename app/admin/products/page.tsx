import { connection } from 'next/server';
import {
  getProductTableData,
  getCategoryList,
  getIngredientList,
  getPizzaSizesList,
  getPizzaTypesList,
} from '@/server';
import { Products } from '@/components/admin';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  await connection();
  const {
    search = '',
    categoryId = 'all',
    page = '1',
    limit = '10',
  } = await searchParams;

  const [categoriesData, ingredientsData, sizesData, typesData] =
    await Promise.all([
      getCategoryList(),
      getIngredientList(),
      getPizzaSizesList(),
      getPizzaTypesList(),
    ]);

  const productsPromise = getProductTableData(
    search,
    categoryId,
    Number(page),
    Number(limit),
  );

  return (
    <Products
      productsPromise={productsPromise}
      categories={categoriesData}
      ingredients={ingredientsData}
      sizes={sizesData}
      types={typesData}
    />
  );
}
