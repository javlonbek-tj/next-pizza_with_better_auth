'use client';

import { CategoryFormDialog } from './CategoryFormDialog';
import { AddButton, DeleteDialog, TableActions } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDelete, useTableActions } from '@/hooks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category, CategoryWithProductCount } from '@/types';
import { deleteCategory } from '@/app/actions';

interface Props {
  data: CategoryWithProductCount[];
}

export function CategoriesTable({ data }: Props) {
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

      {data?.length === 0 ? (
        <div className='mt-10 text-2xl text-center text-muted-foreground'>
          Категории не найдены
        </div>
      ) : (
        <Card className='overflow-x-auto border border-gray-200 shadow-md rounded-xl'>
          <CardContent className='p-6'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50 hover:bg-gray-50'>
                  <TableHead className='py-3 font-extrabold tracking-wide text-gray-700 uppercase'>
                    №
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-gray-700 uppercase'>
                    Название
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-gray-700 uppercase'>
                    Слаг
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-center text-gray-700 uppercase'>
                    Количество продуктов
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-center text-gray-700 uppercase'>
                    Дата создания
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-right text-gray-700 uppercase'>
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map(
                  (category: CategoryWithProductCount, index: number) => (
                    <TableRow
                      key={category.id}
                      className='transition-colors hover:bg-gray-50'
                    >
                      <TableCell className='py-4'>
                        <div className='flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg shadow-md bg-linear-to-br from-primary to-primary/80'>
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className='py-4'>
                        <span className='font-semibold text-gray-900'>
                          {category.name}
                        </span>
                      </TableCell>
                      <TableCell className='py-4'>
                        <code className='px-2 py-1 font-mono text-sm text-gray-700 bg-gray-100 rounded'>
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className='py-4 text-center'>
                        <Badge
                          variant={
                            category._count?.products > 0
                              ? 'default'
                              : 'secondary'
                          }
                          className={`px-3 py-1 text-sm font-semibold ${
                            category._count?.products > 0
                              ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {category._count?.products || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className='py-4 text-center text-gray-600'>
                        {new Date(category.createdAt).toLocaleDateString(
                          'ru-RU',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}
                      </TableCell>
                      <TableCell className='space-x-2 text-right'>
                        <TableActions
                          edit={() => handleEdit(category)}
                          deleteAction={() => handleOpenDelete(category.id)}
                          disabled={category._count?.products > 0}
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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
