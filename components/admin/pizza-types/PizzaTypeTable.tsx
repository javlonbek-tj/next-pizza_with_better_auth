'use client';

import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteDialog } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { PizzaType } from '@/lib/generated/prisma';
import { PizzaTypeFormDialog } from './PizzaTypeFormDialog';
import {
  useDeletePizzaType,
  useGetPizzaTypes,
} from '@/hooks/admin/use-pizza-types';

export function PizzaTypeTable() {
  const [editingType, setEditingType] = useState<PizzaType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: types, isPending } = useGetPizzaTypes();
  const { mutate: deleteType, isPending: isDeleting } = useDeletePizzaType();

  const handleDelete = () => {
    if (deleteId) {
      deleteType(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const handleEdit = (type: PizzaType) => {
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingType(null);
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)} className="cursor-pointer">
          <Plus className="mr-2 w-4 h-4" />
          Добавить тип
        </Button>
      </div>

      {!types?.length ? (
        <div className="mt-10 text-muted-foreground text-2xl text-center">
          Типы не найдены
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
                    Дата создания
                  </TableHead>
                  <TableHead className="py-3 font-extrabold text-gray-700 text-right uppercase tracking-wide">
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {types.map((type, index) => (
                  <TableRow
                    key={type.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-md rounded-lg w-8 h-8 font-bold text-white">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-gray-900">
                        {type.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600 text-center">
                      {new Date(type.createdAt).toLocaleDateString('ru-RU', {
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
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(type.id)}
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

      <PizzaTypeFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        pizzaType={editingType}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Удалить размер"
        description="Вы уверены, что хотите удалить этот размер? Это действие нельзя отменить."
      />
    </div>
  );
}
