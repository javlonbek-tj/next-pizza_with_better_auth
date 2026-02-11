'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddButton, DeleteDialog, TableActions } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { PizzaSize, PizzaSizeWithProductCount } from '@/types';
import { PizzaSizeFormDialog } from './PizzaSizeFormDialog';
import { useTableActions } from '@/hooks';
import { useDelete } from '@/hooks/admin/use-delete';
import { deletePizzaSize } from '@/app/actions';

interface PizzaSizeTableProps {
  data: PizzaSizeWithProductCount[];
}

export function PizzaSizeTable({ data }: PizzaSizeTableProps) {
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

      {data.length === 0 ? (
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
                {data.map((size: PizzaSizeWithProductCount, index: number) => (
                  <TableRow
                    key={size.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <TableCell className='py-4'>
                      <div className='flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg shadow-md bg-linear-to-br from-primary to-primary/80'>
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
                      <TableActions
                        edit={() => handleEdit(size)}
                        deleteAction={() => handleOpenDelete(size.id)}
                        disabled={size._count?.productItems > 0}
                      />
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
        onConfirm={() => handleDelete(deleteId!)}
        title='Удалить размер'
        description='Вы уверены, что хотите удалить этот размер? Это действие нельзя отменить.'
        showAlert={true}
        alertDescription='Все связанные элементы продукта, использующие этот размер,
              будут установлены как «Стандартный» после удаления.'
        isDeleting={isDeleting}
      />
    </div>
  );
}
