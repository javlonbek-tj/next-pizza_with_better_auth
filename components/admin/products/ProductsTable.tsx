'use client';

import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useTableActions } from '@/hooks';
import { useGetProducts } from '@/hooks/admin/use-products';
import { ProductFormDialog } from './ProductFormDialog';

export function ProductsTable() {
  const {
    editingItem: editingProduct,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<ProductWithRelations>();

  const { data: products, isPending } = useGetProducts();
  /*   const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId, {
        onSuccess: handleCloseDelete,
      });
    }
  }; */

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='продукт' />
      </div>

      {isPending ? (
        <Card className='shadow-md border border-gray-200 rounded-xl'>
          <CardContent className='p-6 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='w-full h-20' />
            ))}
          </CardContent>
        </Card>
      ) : !products?.length ? (
        <div className='mt-10 text-muted-foreground text-2xl text-center'>
          Продукты не найдены
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
                  <TableHead className='py-3 font-extrabold text-gray-700 uppercase tracking-wide'>
                    Категория
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide'>
                    Варианты
                  </TableHead>
                  <TableHead className='py-3 font-extrabold text-gray-700 text-center uppercase tracking-wide'>
                    Ингредиенты
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
                {products?.map(
                  (product: ProductWithRelations, index: number) => (
                    <TableRow
                      key={product.id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      {/* Number */}
                      <TableCell className='py-4'>
                        <div className='flex justify-center items-center bg-gradient-to-br from-primary to-primary/80 shadow-md rounded-lg w-8 h-8 font-bold text-white'>
                          {index + 1}
                        </div>
                      </TableCell>

                      {/* Image */}
                      <TableCell className='py-4'>
                        <div className='relative border border-gray-200 rounded-lg w-16 h-16 overflow-hidden'>
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell className='py-4'>
                        <span className='font-semibold text-gray-900'>
                          {product.name}
                        </span>
                      </TableCell>

                      {/* Category */}
                      <TableCell className='py-4'>
                        {product.category ? (
                          <Badge
                            variant='outline'
                            className='bg-violet-50 text-violet-700 border-violet-200'
                          >
                            {product.category.name}
                          </Badge>
                        ) : (
                          <span className='text-gray-400 text-sm'>
                            Без категории
                          </span>
                        )}
                      </TableCell>

                      {/* Product Items Count */}
                      <TableCell className='py-4 text-center'>
                        <Badge
                          variant='default'
                          className='bg-blue-100 text-blue-700 hover:bg-blue-200'
                        >
                          {product.productItems?.length || 0}
                        </Badge>
                      </TableCell>

                      {/* Ingredients Count */}
                      <TableCell className='py-4 text-center'>
                        <Badge
                          variant='secondary'
                          className='bg-green-100 text-green-700'
                        >
                          {product.ingredients?.length || 0}
                        </Badge>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className='py-4 text-gray-600 text-center'>
                        {new Date(product.createdAt).toLocaleDateString(
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
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          className='cursor-pointer'
                          variant='destructive'
                          size='sm'
                          onClick={() => handleOpenDelete(product.id)}
                        >
                          <Trash2 className='w-4 h-4' />
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

      <ProductFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        product={editingProduct}
      />

      {/* <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title='Удалить продукт'
        description='Вы уверены, что хотите удалить этот продукт? Это действие нельзя отменить. Все связанные варианты продукта также будут удалены.'
      /> */}
    </div>
  );
}
