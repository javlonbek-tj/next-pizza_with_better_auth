'use client';

import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Ingredient } from '@/types';
import { deleteIngredient } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { IngredientsTable } from './IngredientsTable';
import { IngredientFormDialog } from './IngredientFormDialog';
import { PaginationWrapper } from '../table/PaginationWrapper';

interface Props {
  ingredients: Ingredient[];
  totalCount: number;
}

export function Ingredients({ ingredients, totalCount }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

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

  const startIndex = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <SimpleTableFilters
            search={search}
            handleSearch={handleSearch}
            placeholder="Поиск ингредиентов..."
          />
        </div>
        <AddButton onClick={handleCreate} text="ингредиент" />
      </div>

      <IngredientsTable
        ingredients={ingredients}
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
        title="Удалить ингредиент"
        description="Вы уверены, что хотите удалить этот ингредиент? Это действие нельзя отменить."
      />
    </div>
  );
}
