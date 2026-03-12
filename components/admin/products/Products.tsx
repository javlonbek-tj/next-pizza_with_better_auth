'use client';

import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog, Spinner } from '@/components/shared';
import type {
  Category,
  Ingredient,
  PizzaSize,
  PizzaType,
  Product,
} from '@/types';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { deleteProduct } from '@/app/actions';
import { ProductFormDialog } from './ProductFormDialog';
import { ProductTable } from './ProductTable';
import { ProductTableFilters } from './ProductTableFilters';
import { PaginationWrapper } from '@/components/admin/table/PaginationWrapper';

interface Props {
  products: Product[];
  totalCount: number;
  ingredients: Ingredient[];
  categories: Category[];
  sizes: PizzaSize[];
  types: PizzaType[];
}

export function Products({
  products,
  totalCount,
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

  const totalPages = Math.ceil(totalCount / limit);
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
  } = useTableActions<Product>();

  const { isDeleting, handleDelete } = useDelete(deleteProduct, {
    successMessage: 'Продукт успешно удален',
    errorMessage: 'Ошибка при удалении продукта',
    onSuccess: handleCloseDelete,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AddButton onClick={handleCreate} text="продукт" />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <ProductTableFilters
          search={search}
          handleSearch={handleSearch}
          categories={categories}
          categoryId={categoryId}
          handleFilterChange={handleFilterChange}
        />

        <div className="p-4 overflow-hidden">
          {isFilterLoading && <Spinner size="sm" />}

          <ProductTable
            products={products}
            startIndex={startIndex}
            isLoading={isFilterLoading}
            onEdit={handleEdit}
            onDelete={handleOpenDelete}
          />

          {totalPages > 1 && (
            <div
              className={`transition-opacity duration-200 ${
                isFilterLoading ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <PaginationWrapper
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={limit}
                setIsPending={setIsPending}
              />
            </div>
          )}
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
        title="Удалить продукт?"
        description="Вы уверены, что хотите удалить продукт? Это действие нельзя отменить."
      />
    </div>
  );
}
