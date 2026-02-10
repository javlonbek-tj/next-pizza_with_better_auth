'use client';

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
import { AddButton, DeleteDialog } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { PizzaSize, PizzaSizeWithProductCount } from '@/types';
import { PizzaSizeFormDialog } from './PizzaSizeFormDialog';
import { useTableActions } from '@/hooks';
import { deletePizzaSize } from '@/app/actions';
import toast from 'react-hot-toast';

interface PizzaSizeTableProps {
  data: PizzaSizeWithProductCount[]
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


  const handleDelete = async () => {
    if (deleteId) {
      const result = await deletePizzaSize(deleteId);
      if (result.success) {
        toast.success('Размер успешно удален');
        handleCloseDelete();
      }
      if (!result.success) {
        toast.error(result.message || 'Ошибка при удалении размера');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={handleCreate} text="размер" />
      </div>

      {data.length === 0 ? (
        <div className="mt-10 text-muted-foreground text-2xl text-center">
          Размеры не найдены
        </div>
      ) : (
        <Card className="shadow-md border border-gray-200 rounded-xl overflow-x-auto">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="py-3 font-extrabold text-gray-700 uppercase tracking-wide">
                    №
                  </TableHead>
                  <TableHead className="py-3 font-extrabold text-gray-700 uppercase tracking-wide">
                    Название
                  </TableHead>
                  <TableHead className="py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide">
                    Диаметр (см)
                  </TableHead>
                  <TableHead className="py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide">
                    Дата создания
                  </TableHead>
                  <TableHead className="py-3 font-extrabold text-gray-700 text-right uppercase tracking-wide">
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((size: PizzaSizeWithProductCount, index: number) => (
                  <TableRow
                    key={size.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-md rounded-lg w-8 h-8 font-bold text-white">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-gray-900">
                        {size.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-gray-700 text-center">
                      {size.size}
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-center">
                      {new Date(size.createdAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(size)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenDelete(size.id)}
                        disabled={size._count?.productItems > 0}
                      >
                        <Trash2 className="w-4 h-4" />
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
        title="Удалить размер"
        description="Вы уверены, что хотите удалить этот размер? Это действие нельзя отменить."
        showAlert={true}
        alertDescription="Все связанные элементы продукта, использующие этот размер,
              будут установлены как «Стандартный» после удаления."
      />
    </div>
  );
}
