'use client';

import { useState } from 'react';
import { Package, Pizza, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog, TableActions } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ProductWithRelations } from '@/types';
import { useTableActions } from '@/hooks';
import { useDeleteProduct, useGetProducts } from '@/hooks/admin/use-products';
import { ProductFormDialog } from './ProductFormDialog';

export function Products() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const toggleRow = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId, {
        onSuccess: handleCloseDelete,
      });
    }
  };

  if (isPending) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-end'>
          <AddButton onClick={handleCreate} text='продукт' />
        </div>
        <div className='overflow-hidden border rounded-lg'>
          <table className='w-full'>
            <thead className='border-b bg-gray-50'>
              <tr>
                <th className='w-12 px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'></th>
                <th className='w-20 px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                  Фото
                </th>
                <th className='px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                  Название
                </th>
                <th className='px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                  Категория
                </th>
                <th className='px-4 py-3 text-xs font-medium text-center text-gray-500 uppercase'>
                  Варианты
                </th>
                <th className='px-4 py-3 text-xs font-medium text-center text-gray-500 uppercase'>
                  Ингредиенты
                </th>
                <th className='px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                  Дата
                </th>
                <th className='px-4 py-3 text-xs font-medium text-right text-gray-500 uppercase'>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-6 h-6' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-16 h-16' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-32 h-4' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-20 h-4' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-8 h-4 mx-auto' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-8 h-4 mx-auto' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-24 h-4' />
                  </td>
                  <td className='px-4 py-4'>
                    <Skeleton className='w-16 h-8 ml-auto' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-end'>
          <AddButton onClick={handleCreate} text='продукт' />
        </div>
        <Card className='border-2 border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-16'>
            <Package className='w-16 h-16 mb-4 text-gray-300' />
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>
              Нет продуктов
            </h3>
            <p className='max-w-sm mb-6 text-center text-gray-500'>
              Начните с создания вашего первого продукта
            </p>
            <AddButton onClick={handleCreate} text='первый продукт' />
          </CardContent>
        </Card>

        <ProductFormDialog
          open={isFormOpen}
          onClose={handleCloseForm}
          product={editingProduct}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='продукт' />
      </div>

      <div className='overflow-hidden border rounded-lg'>
        <table className='w-full'>
          <thead className='border-b bg-gray-50'>
            <tr>
              <th className='w-12 px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'></th>
              <th className='w-20 px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                Фото
              </th>
              <th className='px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                Название
              </th>
              <th className='px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                Категория
              </th>
              <th className='px-4 py-3 text-xs font-medium text-center text-gray-500 uppercase'>
                Варианты
              </th>
              <th className='px-4 py-3 text-xs font-medium text-center text-gray-500 uppercase'>
                Ингредиенты
              </th>
              <th className='px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase'>
                Дата
              </th>
              <th className='px-4 py-3 text-xs font-medium text-right text-gray-500 uppercase'>
                Действия
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {products.map((product: ProductWithRelations) => {
              const isExpanded = expandedRows.has(product.id);
              const hasVariants =
                product.productItems && product.productItems.length > 0;
              const hasIngredients =
                product.ingredients && product.ingredients.length > 0;

              return (
                <>
                  {/* Main Row */}
                  <tr
                    key={product.id}
                    className='transition-colors hover:bg-gray-50'
                  >
                    <td className='px-4 py-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleRow(product.id)}
                        className='w-8 h-8 p-0'
                      >
                        {isExpanded ? (
                          <ChevronDown className='w-4 h-4' />
                        ) : (
                          <ChevronRight className='w-4 h-4' />
                        )}
                      </Button>
                    </td>
                    <td className='px-4 py-4'>
                      <div className='flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-lg'>
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={64}
                          height={64}
                          className='object-contain'
                        />
                      </div>
                    </td>
                    <td className='px-4 py-4 font-semibold text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-4 py-4'>
                      {product.category ? (
                        <Badge
                          variant='secondary'
                          className='text-blue-700 border-blue-200 bg-blue-50'
                        >
                          {product.category.name}
                        </Badge>
                      ) : (
                        <span className='text-sm text-gray-400'>—</span>
                      )}
                    </td>
                    <td className='px-4 py-4 text-center'>
                      <Badge
                        variant='secondary'
                        className='text-purple-700 border-purple-200 bg-purple-50'
                      >
                        {product.productItems?.length || 0}
                      </Badge>
                    </td>
                    <td className='px-4 py-4 text-center'>
                      <Badge
                        variant='secondary'
                        className='text-green-700 border-green-200 bg-green-50'
                      >
                        {product.ingredients?.length || 0}
                      </Badge>
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500'>
                      {new Date(product.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className='px-4 py-4'>
                      <div className='flex justify-end gap-2'>
                        <TableActions
                          edit={() => handleEdit(product)}
                          deleteAction={() => handleOpenDelete(product.id)}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className='px-4 py-6 bg-gray-50'>
                        <div className='grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2'>
                          {/* Variants Section */}
                          <div>
                            <h4 className='flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900'>
                              <Package className='w-4 h-4 text-purple-600' />
                              Варианты продукта
                            </h4>
                            {hasVariants ? (
                              <div className='space-y-2'>
                                {product.productItems.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className='flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg'
                                  >
                                    <div className='flex items-center gap-2'>
                                      {item.size && item.type ? (
                                        <>
                                          <Pizza className='w-4 h-4 text-orange-500' />
                                          <span className='text-sm text-gray-700'>
                                            {item.size.label} • {item.type.type}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Package className='w-4 h-4 text-gray-500' />
                                          <span className='text-sm text-gray-700'>
                                            Стандартный
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <span className='font-semibold text-gray-900'>
                                      {item.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className='text-sm italic text-gray-400'>
                                Нет вариантов
                              </p>
                            )}
                          </div>

                          {/* Ingredients Section */}
                          <div>
                            <h4 className='flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900'>
                              <Package className='w-4 h-4 text-green-600' />
                              Ингредиенты
                            </h4>
                            {hasIngredients ? (
                              <div className='grid grid-cols-2 gap-2'>
                                {product.ingredients.map((ingredient, idx) => (
                                  <div
                                    key={idx}
                                    className='flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg'
                                  >
                                    <div className='flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-lg shrink-0'>
                                      <Image
                                        src={ingredient.imageUrl}
                                        alt={ingredient.name}
                                        width={40}
                                        height={40}
                                        className='object-contain'
                                      />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <p className='text-sm font-medium text-gray-900 truncate'>
                                        {ingredient.name}
                                      </p>
                                      <p className='text-xs text-gray-500'>
                                        {ingredient.price.toLocaleString(
                                          'ru-RU',
                                        )}{' '}
                                        ₽
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className='text-sm italic text-gray-400'>
                                Без ингредиентов
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <ProductFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        product={editingProduct}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        title='Удалить продукт?'
        description='Вы уверены, что хотите удалить продукт? Это действие нельзя отменить.'
      />
    </div>
  );
}
