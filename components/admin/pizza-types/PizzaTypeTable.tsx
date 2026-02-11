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
import { PizzaType, PizzaTypeWithProductCount } from '@/types';
import { PizzaTypeFormDialog } from './PizzaTypeFormDialog';
import { useTableActions } from '@/hooks';
import { useDelete } from '@/hooks/admin/use-delete';
import { deletePizzaType } from '@/app/actions';

interface PizzaTypeTableProps {
  data: PizzaTypeWithProductCount[];
}

export function PizzaTypeTable({ data }: PizzaTypeTableProps) {
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

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='тип пиццы' />
      </div>
      {data.length === 0 ? (
        <div className='mt-10 text-2xl text-center text-muted-foreground'>
          Типы пицц не найдены
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
                    Дата создания
                  </TableHead>
                  <TableHead className='py-3 font-extrabold tracking-wide text-right text-gray-700 uppercase'>
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((type: PizzaTypeWithProductCount, index: number) => (
                  <TableRow
                    key={type.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <TableCell className='py-4'>
                      <div className='flex items-center justify-center w-8 h-8 font-bold text-white rounded-lg shadow-md bg-linear-to-br from-primary to-primary/80'>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <span className='font-semibold text-gray-900'>
                        {type.type}
                      </span>
                    </TableCell>
                    <TableCell className='py-4 text-center text-gray-600'>
                      {new Date(type.createdAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className='space-x-2 text-right'>
                      <TableActions
                        edit={() => handleEdit(type)}
                        deleteAction={() => handleOpenDelete(type.id)}
                        disabled={type._count?.productItems > 0}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
        title='Удалить тип пиццы'
        description='Вы уверены, что хотите удалить этот тип пиццы? Это действие нельзя отменить.'
      />
    </div>
  );
}
