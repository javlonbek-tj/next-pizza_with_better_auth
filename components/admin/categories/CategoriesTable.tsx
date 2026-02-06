'use client';

import { Edit, Trash2 } from 'lucide-react';

import { CategoryFormDialog } from './CategoryFormDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useDeleteCategory,
  useGetCategories,
} from '@/hooks/admin/use-categories';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableActions } from '@/hooks';
import { Category, CategoryWithProductCount } from '@/types';

export function CategoriesTable() {
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

  const { data: categories, isPending } = useGetCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleDelete = () => {
    if (deleteId) {
      deleteCategory(deleteId, {
        onSuccess: handleCloseDelete,
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='категория' />
      </div>

      {isPending ? (
        <Card className='border border-gray-200 shadow-md rounded-xl'>
          <CardContent className='p-6 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='w-full h-16' />
            ))}
          </CardContent>
        </Card>
      ) : !categories?.length ? (
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
                {categories?.map(
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
                        <Button
                          className='cursor-pointer'
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          className='cursor-pointer'
                          variant='destructive'
                          size='sm'
                          onClick={() => handleOpenDelete(category.id)}
                          disabled={category._count?.products > 0}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
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
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title='Удалить категорию'
        description='Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.'
      />
    </div>
  );
}
