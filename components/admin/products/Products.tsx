'use client';

import { useState } from 'react';
import {
  Edit,
  Trash2,
  Package,
  Pizza,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { AddButton, DeleteDialog } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ProductWithRelations } from '@/prisma/@types/prisma';
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
      <div className="space-y-6">
        <div className="flex justify-end">
          <AddButton onClick={handleCreate} text="продукт" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 w-12 font-medium text-gray-500 text-xs text-left uppercase"></th>
                <th className="px-4 py-3 w-20 font-medium text-gray-500 text-xs text-left uppercase">
                  Фото
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase">
                  Название
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase">
                  Категория
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-center uppercase">
                  Варианты
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-center uppercase">
                  Ингредиенты
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase">
                  Дата
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs text-right uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <Skeleton className="w-6 h-6" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="w-16 h-16" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="w-32 h-4" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="w-20 h-4" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="mx-auto w-8 h-4" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="mx-auto w-8 h-4" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="w-24 h-4" />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton className="ml-auto w-16 h-8" />
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
      <div className="space-y-6">
        <div className="flex justify-end">
          <AddButton onClick={handleCreate} text="продукт" />
        </div>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col justify-center items-center py-16">
            <Package className="mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 font-semibold text-gray-900 text-xl">
              Нет продуктов
            </h3>
            <p className="mb-6 max-w-sm text-gray-500 text-center">
              Начните с создания вашего первого продукта
            </p>
            <AddButton onClick={handleCreate} text="первый продукт" />
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <AddButton onClick={handleCreate} text="продукт" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-12 font-medium text-gray-500 text-xs text-left uppercase"></th>
              <th className="px-4 py-3 w-20 font-medium text-gray-500 text-xs text-left uppercase">
                Фото
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase">
                Название
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase">
                Категория
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-center uppercase">
                Варианты
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-center uppercase">
                Ингредиенты
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase">
                Дата
              </th>
              <th className="px-4 py-3 font-medium text-gray-500 text-xs text-right uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(product.id)}
                        className="p-0 w-8 h-8"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center items-center bg-gray-100 rounded-lg w-16 h-16 overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-4">
                      {product.category ? (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 border-blue-200 text-blue-700"
                        >
                          {product.category.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge
                        variant="secondary"
                        className="bg-purple-50 border-purple-200 text-purple-700"
                      >
                        {product.productItems?.length || 0}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge
                        variant="secondary"
                        className="bg-green-50 border-green-200 text-green-700"
                      >
                        {product.ingredients?.length || 0}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {new Date(product.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenDelete(product.id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 px-4 py-6">
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 max-w-6xl">
                          {/* Variants Section */}
                          <div>
                            <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-900 text-sm">
                              <Package className="w-4 h-4 text-purple-600" />
                              Варианты продукта
                            </h4>
                            {hasVariants ? (
                              <div className="space-y-2">
                                {product.productItems.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      {item.size && item.type ? (
                                        <>
                                          <Pizza className="w-4 h-4 text-orange-500" />
                                          <span className="text-gray-700 text-sm">
                                            {item.size.label} • {item.type.type}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Package className="w-4 h-4 text-gray-500" />
                                          <span className="text-gray-700 text-sm">
                                            Стандартный
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                      {item.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm italic">
                                Нет вариантов
                              </p>
                            )}
                          </div>

                          {/* Ingredients Section */}
                          <div>
                            <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-900 text-sm">
                              <Package className="w-4 h-4 text-green-600" />
                              Ингредиенты
                            </h4>
                            {hasIngredients ? (
                              <div className="gap-2 grid grid-cols-2">
                                {product.ingredients.map((ingredient, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-lg"
                                  >
                                    <div className="flex flex-shrink-0 justify-center items-center bg-gray-100 rounded-lg w-10 h-10 overflow-hidden">
                                      <Image
                                        src={ingredient.imageUrl}
                                        alt={ingredient.name}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 text-sm truncate">
                                        {ingredient.name}
                                      </p>
                                      <p className="text-gray-500 text-xs">
                                        {ingredient.price.toLocaleString(
                                          'ru-RU'
                                        )}{' '}
                                        ₽
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm italic">
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
        title="Удалить продукт?"
        description="Вы уверены, что хотите удалить продукт? Это действие нельзя отменить."
      />
    </div>
  );
}
