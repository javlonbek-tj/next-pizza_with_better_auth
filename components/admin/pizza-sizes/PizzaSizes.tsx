'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { TableBodySkeleton } from '@/components/skeletons';
import { PizzaSize, PizzaSizeWithProductCount } from '@/types';
import { deletePizzaSize } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { TablePaginationAsync } from '../table/TablePaginationAsync';
import { PizzaSizeTable } from './PizzaSizeTable';
import { PizzaSizeTableBody } from './PizzaSizeTableBody';
import { PizzaSizeFormDialog } from './PizzaSizeFormDialog';

interface Props {
  dataPromise: Promise<{ data: PizzaSizeWithProductCount[]; total: number }>;
}

export function PizzaSizes({ dataPromise }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const startIndex = (page - 1) * limit;

  const {
    editingItem: editingPizzaSize,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<PizzaSize>();

  const { isDeleting, handleDelete } = useDelete(deletePizzaSize, {
    onSuccess: handleCloseDelete,
    successMessage: 'Размер успешно удален',
    errorMessage: 'Ошибка при удалении размера',
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='размер' />
      </div>

      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <SimpleTableFilters
          search={search}
          handleSearch={handleSearch}
          placeholder='Поиск размеров...'
        />

        <div className='p-4 overflow-hidden'>
          <PizzaSizeTable>
            <Suspense fallback={<TableBodySkeleton colSpan={4} />}>
              <PizzaSizeTableBody
                dataPromise={dataPromise}
                startIndex={startIndex}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleOpenDelete}
              />
            </Suspense>
          </PizzaSizeTable>

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

      <PizzaSizeFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        pizzaSize={editingPizzaSize}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={() => handleDelete(deleteId!)}
        isDeleting={isDeleting}
        title='Удалить размер'
        description='Вы уверены, что хотите удалить этот размер? Это действие нельзя отменить.'
        showAlert={true}
        alertDescription='Все связанные элементы продукта, использующие этот размер, будут установлены как «Стандартный» после удаления.'
      />
    </div>
  );
}
