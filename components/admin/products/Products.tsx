'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import type {
  Category,
  Ingredient,
  PizzaSize,
  PizzaType,
  Product,
  ProductWithCategory,
} from '@/types';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { deleteProduct } from '@/app/actions';
import { Api } from '@/services/api-client';
import { ProductFormDialog } from './ProductFormDialog';
import { ProductTable } from './ProductTable';
import { ProductTableBody } from './ProductTableBody';
import { ProductTableFilters } from './ProductTableFilters';
import { ProductPaginationAsync } from './ProductPaginationAsync';
import { TableBodySkeleton } from '@/components/skeletons';

interface Props {
  productsPromise: Promise<{ data: Product[]; total: number }>;
  ingredients: Ingredient[];
  categories: Category[];
  sizes: PizzaSize[];
  types: PizzaType[];
}

export function Products({
  productsPromise,
  ingredients,
  categories,
  sizes,
  types,
}: Props) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || 'all';

  const startIndex = (page - 1) * limit;

  const {
    handleSearch,
    handleFilterChange,
    isLoading: isFilterLoading,
    setIsPending,
  } = useTableFilters();

  const {
    editingItem: editingProduct,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<ProductWithCategory>();

  const handleEditProduct = async (product: Product) => {
    const full = await Api.products.getProduct(product.id);
    handleEdit(full as ProductWithCategory);
  };

  const { isDeleting, handleDelete } = useDelete(deleteProduct, {
    successMessage: 'Продукт успешно удален',
    errorMessage: 'Ошибка при удалении продукта',
    onSuccess: handleCloseDelete,
  });

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='продукт' />
      </div>

      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <ProductTableFilters
          search={search}
          handleSearch={handleSearch}
          categories={categories}
          categoryId={categoryId}
          handleFilterChange={handleFilterChange}
        />

        <div className='p-4 overflow-hidden'>
          <ProductTable>
            <Suspense fallback={<TableBodySkeleton colSpan={7} />}>
              <ProductTableBody
                productsPromise={productsPromise}
                startIndex={startIndex}
                isLoading={isFilterLoading}
                onEdit={handleEditProduct}
                onDelete={handleOpenDelete}
              />
            </Suspense>
          </ProductTable>

          <Suspense fallback={null}>
            <ProductPaginationAsync
              productsPromise={productsPromise}
              page={page}
              limit={limit}
              isLoading={isFilterLoading}
              setIsPending={setIsPending}
            />
          </Suspense>
        </div>
      </div>

      <ProductFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        product={editingProduct}
        categories={categories}
        ingredients={ingredients}
        sizes={sizes}
        types={types}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        isDeleting={isDeleting}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title='Удалить продукт?'
        description='Вы уверены, что хотите удалить продукт? Это действие нельзя отменить.'
      />
    </div>
  );
}
