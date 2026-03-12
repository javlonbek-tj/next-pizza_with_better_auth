'use client';

import { useSearchParams } from 'next/navigation';
import { AddButton, DeleteDialog, Spinner } from '@/components/shared';
import { Category, CategoryWithProductCount } from '@/types';
import { deleteCategory } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { CategoriesTable } from './CategoriesTable';
import { CategoryFormDialog } from './CategoryFormDialog';
import { PaginationWrapper } from '../table/PaginationWrapper';

interface Props {
  categories: CategoryWithProductCount[];
  totalCount: number;
}

export function Categories({ categories, totalCount }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

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

  const startIndex = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={handleCreate} text="категория" />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <SimpleTableFilters
          search={search}
          handleSearch={handleSearch}
          placeholder="Поиск категорий..."
        />

        <div className="p-4 overflow-hidden">
          {isLoading && <Spinner size="sm" />}

          <CategoriesTable
            data={categories}
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
        title="Удалить категорию"
        description="Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить."
      />
    </div>
  );
}
