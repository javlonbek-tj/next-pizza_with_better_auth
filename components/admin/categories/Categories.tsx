'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { TableBodySkeleton } from '@/components/skeletons';
import { Category, CategoryWithProductCount } from '@/types';
import { deleteCategory } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { TablePaginationAsync } from '../table/TablePaginationAsync';
import { CategoriesTable } from './CategoriesTable';
import { CategoriesTableBody } from './CategoriesTableBody';
import { CategoryFormDialog } from './CategoryFormDialog';

interface Props {
  dataPromise: Promise<{ data: CategoryWithProductCount[]; total: number }>;
}

export function Categories({ dataPromise }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const startIndex = (page - 1) * limit;

  const {
    editingItem: editingCategory,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<Category>();

  const { isDeleting, handleDelete } = useDelete(deleteCategory, {
    onSuccess: handleCloseDelete,
    successMessage: 'Категория успешно удалена',
    errorMessage: 'Ошибка удаления категории',
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='категория' />
      </div>

      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <SimpleTableFilters
          search={search}
          handleSearch={handleSearch}
          placeholder='Поиск категорий...'
        />

        <div className='p-4 overflow-hidden'>
          <CategoriesTable>
            <Suspense fallback={<TableBodySkeleton colSpan={5} />}>
              <CategoriesTableBody
                dataPromise={dataPromise}
                startIndex={startIndex}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleOpenDelete}
              />
            </Suspense>
          </CategoriesTable>

          <Suspense fallback={null}>
            <TablePaginationAsync
              dataPromise={dataPromise}
              page={page}
              limit={limit}
              isLoading={isLoading}
              setIsPending={setIsPending}
            />
          </Suspense>
        </div>
      </div>

      <CategoryFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        category={editingCategory}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={() => handleDelete(deleteId!)}
        isDeleting={isDeleting}
        title='Удалить категорию'
        description='Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.'
      />
    </div>
  );
}
