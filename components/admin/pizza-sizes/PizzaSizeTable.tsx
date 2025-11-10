'use client';

import {
  useGetPizzaSizes,
  useDeletePizzaSize,
} from '@/hooks/admin/use-pizza-sizes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { PizzaSize } from '@/lib/generated/prisma';
import { PizzaSizeFormDialog } from './PizzaSizeFormDialog';
import { useTableActions } from '@/hooks';
import { PizzaSizeWithProductCount } from '@/prisma/@types/prisma';

export function PizzaSizeTable() {
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

  const { data: sizes, isPending } = useGetPizzaSizes();
  const { mutate: deleteSize, isPending: isDeleting } = useDeletePizzaSize();

  const handleDelete = () => {
    if (deleteId) {
      deleteSize(deleteId, {
        onSuccess: handleCloseDelete,
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='размер' />
      </div>

      {isPending ? (
        <Card className='border border-gray-200 shadow-md rounded-xl'>
          <CardContent className='p-6 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='w-full h-16' />
            ))}
          </CardContent>
        </Card>
      ) : !sizes?.length ? (
        <div className='mt-10 text-2xl text-center text-muted-foreground'>
          Размеры не найдены
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
                  <TableHead className='py-3 font-extrabold tracking-wide text-center text-gray-700 uppercase'>
                    Диаметр (см)
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
                {sizes.map((size: PizzaSizeWithProductCount, index: number) => (
                  <TableRow
                    key={size.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <TableCell className='py-4'>
                      <div className='flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg shadow-md bg-gradient-to-br from-primary to-primary/80'>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <span className='font-semibold text-gray-900'>
                        {size.label}
                      </span>
                    </TableCell>
                    <TableCell className='py-4 text-center text-gray-700'>
                      {size.size}
                    </TableCell>
                    <TableCell className='py-4 text-center text-gray-600'>
                      {new Date(size.createdAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className='space-x-2 text-right'>
                      <Button
                        className='cursor-pointer'
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(size)}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        className='cursor-pointer'
                        variant='destructive'
                        size='sm'
                        onClick={() => handleOpenDelete(size.id)}
                        disabled={size._count?.ProductItem > 0}
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

      <PizzaSizeFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        pizzaSize={editingPizzaSize}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title='Удалить размер'
        description='Вы уверены, что хотите удалить этот размер? Это действие нельзя отменить.'
        showAlert={true}
        alertDescription='Все связанные элементы продукта, использующие этот размер,
              будут установлены как «Стандартный» после удаления.'
      />
    </div>
  );
}
