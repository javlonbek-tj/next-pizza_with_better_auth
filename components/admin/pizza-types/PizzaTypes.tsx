'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { TableBodySkeleton } from '@/components/skeletons';
import { PizzaType, PizzaTypeWithProductCount } from '@/types';
import { deletePizzaType } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { TablePaginationAsync } from '../table/TablePaginationAsync';
import { PizzaTypeTable } from './PizzaTypeTable';
import { PizzaTypeTableBody } from './PizzaTypeTableBody';
import { PizzaTypeFormDialog } from './PizzaTypeFormDialog';

interface Props {
  dataPromise: Promise<{ data: PizzaTypeWithProductCount[]; total: number }>;
}

export function PizzaTypes({ dataPromise }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const startIndex = (page - 1) * limit;

  const {
    editingItem: editingPizzaType,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<PizzaType>();

  const { isDeleting, handleDelete } = useDelete(deletePizzaType, {
    onSuccess: handleCloseDelete,
    successMessage: 'Тип пиццы успешно удален',
    errorMessage: 'Ошибка при удалении типа пиццы',
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='тип пиццы' />
      </div>

      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <SimpleTableFilters
          search={search}
          handleSearch={handleSearch}
          placeholder='Поиск типов пицц...'
        />

        <div className='p-4 overflow-hidden'>
          <PizzaTypeTable>
            <Suspense fallback={<TableBodySkeleton colSpan={3} />}>
              <PizzaTypeTableBody
                dataPromise={dataPromise}
                startIndex={startIndex}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleOpenDelete}
              />
            </Suspense>
          </PizzaTypeTable>

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

      <PizzaTypeFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        pizzaType={editingPizzaType}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={() => handleDelete(deleteId!)}
        isDeleting={isDeleting}
        title='Удалить тип пиццы'
        description='Вы уверены, что хотите удалить этот тип пиццы? Это действие нельзя отменить.'
      />
    </div>
  );
}
