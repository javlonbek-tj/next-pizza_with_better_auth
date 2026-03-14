'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { TableBodySkeleton } from '@/components/skeletons';
import { Ingredient } from '@/types';
import { deleteIngredient } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { TablePaginationAsync } from '../table/TablePaginationAsync';
import { IngredientsTable } from './IngredientsTable';
import { IngredientsTableBody } from './IngredientsTableBody';
import { IngredientFormDialog } from './IngredientFormDialog';

interface Props {
  dataPromise: Promise<{ data: Ingredient[]; total: number }>;
}

export function Ingredients({ dataPromise }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const startIndex = (page - 1) * limit;

  const {
    editingItem: editingIngredient,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<Ingredient>();

  const { isDeleting, handleDelete } = useDelete(deleteIngredient, {
    onSuccess: handleCloseDelete,
    successMessage: 'Ингредиент успешно удален',
    errorMessage: 'Ошибка при удалении ингредиента',
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='ингредиент' />
      </div>

      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <SimpleTableFilters
          search={search}
          handleSearch={handleSearch}
          placeholder='Поиск ингредиентов...'
        />

        <div className='p-4 overflow-hidden'>
          <IngredientsTable>
            <Suspense fallback={<TableBodySkeleton colSpan={5} />}>
              <IngredientsTableBody
                dataPromise={dataPromise}
                startIndex={startIndex}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleOpenDelete}
              />
            </Suspense>
          </IngredientsTable>

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

      <IngredientFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        ingredient={editingIngredient}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={() => handleDelete(deleteId!)}
        isDeleting={isDeleting}
        title='Удалить ингредиент'
        description='Вы уверены, что хотите удалить этот ингредиент? Это действие нельзя отменить.'
      />
    </div>
  );
}
