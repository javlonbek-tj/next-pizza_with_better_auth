'use client';

import { useState } from 'react';
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
import { Edit, Trash2, Plus } from 'lucide-react';
import { IngredientFormDialog } from './IngredientFormDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteDialog } from '@/components/shared';
import { Ingredient } from '@/lib/generated/prisma';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function IngredientsTable() {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: ingredients, isPending } = useGetIngredients();
  const { mutate: deleteIngredient, isPending: isDeleting } =
    useDeleteIngredient();

  const handleDelete = () => {
    if (deleteId) {
      deleteIngredient(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIngredient(null);
  };

  if (isPending) {
    return (
      <div className='space-y-4'>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className='w-full h-16' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button onClick={() => setIsFormOpen(true)} className='cursor-pointer'>
          <Plus className='mr-2 w-4 h-4' />
          Добавить ингредиент
        </Button>
      </div>

      {!ingredients?.length ? (
        <div className='mt-10 text-muted-foreground text-2xl text-center'>
          Ингредиенты не найдены
        </div>
      ) : (
        <Card className='shadow-md border border-gray-200 rounded-xl overflow-x-auto'>
          <CardContent className='p-6'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50 hover:bg-gray-50'>
                  <TableHead className='py-3 font-extrabold text-gray-700 uppercase tracking-wide'>
                    №
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 uppercase tracking-wide'>
                    Изображение
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 uppercase tracking-wide'>
                    Название
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide'>
                    Цена
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide'>
                    Дата создания
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 text-right uppercase tracking-wide'>
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients?.map((ingredient: Ingredient, index: number) => (
                  <TableRow
                    key={ingredient.id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    {/* Number */}
                    <TableCell className='py-2'>
                      <div className='flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-md rounded-lg w-8 h-8 font-bold text-white'>
                        {index + 1}
                      </div>
                    </TableCell>

                    {/* Image */}
                    <TableCell className='py-2'>
                      <div className='relative border border-gray-200 rounded-lg w-12 h-12 overflow-hidden'>
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
                      <div className='inline-flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full'>
                        <span className='font-semibold text-green-700'>
                          {ingredient.price.toLocaleString('ru-RU')}
                        </span>
                        <span className='text-green-600 text-sm'>₽</span>
                      </div>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className='py-2 text-gray-600 text-center'>
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
                        onClick={() => setDeleteId(ingredient.id)}
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
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title='Удалить ингредиент'
        description='Вы уверены, что хотите удалить этот ингредиент? Это действие нельзя отменить.'
      />
    </div>
  );
}
