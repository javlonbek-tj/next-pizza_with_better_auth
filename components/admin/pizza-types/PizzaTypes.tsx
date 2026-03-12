'use client';

import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { PizzaType, PizzaTypeWithProductCount } from '@/types';
import { deletePizzaType } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { PizzaTypeTable } from './PizzaTypeTable';
import { PizzaTypeFormDialog } from './PizzaTypeFormDialog';
import { PaginationWrapper } from '../table/PaginationWrapper';

interface Props {
  types: PizzaTypeWithProductCount[];
  totalCount: number;
}

export function PizzaTypes({ types, totalCount }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isPending, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

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

  const startIndex = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <SimpleTableFilters
            search={search}
            handleSearch={handleSearch}
            placeholder="Поиск типов пицц..."
          />
        </div>
        <AddButton onClick={handleCreate} text="тип пиццы" />
      </div>

      <PizzaTypeTable
        data={types}
        startIndex={startIndex}
        onEdit={handleEdit}
        onDelete={handleOpenDelete}
        isLoading={isPending}
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
        title="Удалить тип пиццы"
        description="Вы уверены, что хотите удалить этот тип пиццы? Это действие нельзя отменить."
      />
    </div>
  );
}
