'use client';

import { Edit, Trash2 } from 'lucide-react';

import { CategoryWithProductCount } from '@/prisma/@types/prisma';
import { CategoryFormDialog } from './CategoryFormDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Category } from '@/lib/generated/prisma/browser';
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={handleCreate} text="категория" />
      </div>

      {isPending ? (
        <Card className="shadow-md border border-gray-200 rounded-xl">
          <CardContent className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-16" />
            ))}
          </CardContent>
        </Card>
      ) : !categories?.length ? (
        <div className="mt-10 text-muted-foreground text-2xl text-center">
          Категории не найдены
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
                  <TableHead className="py-3 font-extrabold text-gray-700 uppercase tracking-wide">
                    Слаг
                  </TableHead>
                  <TableHead className="py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide">
                    Количество продуктов
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
                {categories?.map(
                  (category: CategoryWithProductCount, index: number) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-md rounded-lg w-8 h-8 font-bold text-white">
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-semibold text-gray-900">
                          {category.name}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 text-sm">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="py-4 text-center">
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
                      <TableCell className="py-4 text-gray-600 text-center">
                        {new Date(category.createdAt).toLocaleDateString(
                          'ru-RU',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          className="cursor-pointer"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenDelete(category.id)}
                          disabled={category._count?.products > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
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
        title="Удалить категорию"
        description="Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить."
      />
    </div>
  );
}
