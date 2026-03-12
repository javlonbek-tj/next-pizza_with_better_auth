'use client';

import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { PizzaSize, PizzaSizeWithProductCount } from '@/types';
import { deletePizzaSize } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { PizzaSizeTable } from './PizzaSizeTable';
import { PizzaSizeFormDialog } from './PizzaSizeFormDialog';
import { PaginationWrapper } from '../table/PaginationWrapper';

interface Props {
  sizes: PizzaSizeWithProductCount[];
  totalCount: number;
}

export function PizzaSizes({ sizes, totalCount }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

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

  const startIndex = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <SimpleTableFilters
            search={search}
            handleSearch={handleSearch}
            placeholder="Поиск размеров..."
          />
        </div>
        <AddButton onClick={handleCreate} text="размер" />
      </div>

      <PizzaSizeTable
        data={sizes}
        startIndex={startIndex}
        onEdit={handleEdit}
        onDelete={handleOpenDelete}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <PaginationWrapper
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={limit}
          setIsPending={setIsPending}
        />
      )}

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
        title="Удалить размер"
        description="Вы уверены, что хотите удалить этот размер? Это действие нельзя отменить."
        showAlert={true}
        alertDescription="Все связанные элементы продукта, использующие этот размер, будут установлены как «Стандартный» после удаления."
      />
    </div>
  );
}
