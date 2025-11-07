'use client';

import Image from 'next/image';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  useDeleteIngredient,
  useGetIngredients,
} from '@/hooks/admin/use-ingredients';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IngredientFormDialog } from './IngredientFormDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Ingredient } from '@/lib/generated/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { useTableActions } from '@/hooks';

export function IngredientsTable() {
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

  const { data: ingredients, isPending } = useGetIngredients();
  const { mutate: deleteIngredient, isPending: isDeleting } =
    useDeleteIngredient();

  const handleDelete = () => {
    if (deleteId) {
      deleteIngredient(deleteId, {
        onSuccess: handleCloseDelete,
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='ингредиент' />
      </div>

      {isPending ? (
        <Card className='border border-gray-200 shadow-md rounded-xl'>
          <CardContent className='p-6 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='w-full h-16' />
            ))}
          </CardContent>
        </Card>
      ) : !ingredients?.length ? (
        <div className='mt-10 text-2xl text-center text-muted-foreground'>
          Ингредиенты не найдены
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
                    Изображение
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-gray-700 uppercase'>
                    Название
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-center text-gray-700 uppercase'>
                    Цена
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
                {ingredients?.map((ingredient: Ingredient, index: number) => (
                  <TableRow
                    key={ingredient.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    {/* Number */}
                    <TableCell className='py-2'>
                      <div className='flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg shadow-md bg-gradient-to-br from-primary to-primary/80'>
                        {index + 1}
                      </div>
                    </TableCell>

                    {/* Image */}
                    <TableCell className='py-2'>
                      <div className='relative w-12 h-12 overflow-hidden border border-gray-200 rounded-lg'>
                        <Image
                          src={ingredient.imageUrl}
                          alt={ingredient.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className='py-2'>
                      <span className='font-semibold text-gray-900'>
                        {ingredient.name}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell className='py-2 text-center'>
                      <div className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50'>
                        <span className='font-semibold text-green-700'>
                          {ingredient.price.toLocaleString('ru-RU')}
                        </span>
                        <span className='text-sm text-green-600'>₽</span>
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className='py-2 text-center text-gray-600'>
                      {new Date(ingredient.createdAt).toLocaleDateString(
                        'ru-RU',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className='space-x-2 text-right'>
                      <Button
                        className='cursor-pointer'
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(ingredient)}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        className='cursor-pointer'
                        variant='destructive'
                        size='sm'
                        onClick={() => handleOpenDelete(ingredient.id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <IngredientFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        ingredient={editingIngredient}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title='Удалить ингредиент'
        description='Вы уверены, что хотите удалить этот ингредиент? Это действие нельзя отменить.'
      />
    </div>
  );
}
