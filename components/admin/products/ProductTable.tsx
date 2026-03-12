'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TableActions } from '@/components/admin/table/TableActions';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  startIndex: number;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({
  products,
  startIndex,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg min-h-50 overflow-x-auto">
      <table className="relative w-full border-collapse">
        <thead className="top-0 z-10 sticky bg-gray-100/80 backdrop-blur-md border-gray-200 dark:border-gray-700 border-b">
          <tr>
            <th className="px-6 py-4 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-left uppercase leading-none tracking-widest">
              T/R
            </th>
            <th className="px-6 py-4 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-left uppercase leading-none tracking-widest">
              Фото
            </th>
            <th className="px-6 py-4 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-left uppercase leading-none tracking-widest">
              Название
            </th>
            <th className="px-6 py-4 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-left uppercase leading-none tracking-widest">
              Категория
            </th>
            <th className="px-6 py-4 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-center uppercase leading-none tracking-widest">
              Варианты
            </th>
            <th className="px-6 py-4 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-center uppercase leading-none tracking-widest">
              Ингредиенты
            </th>
            <th className="px-6 py-4 pr-8 2xl:pr-10 font-bold text-[10px] text-gray-900 dark:text-gray-300 3xl:text-xs text-right uppercase leading-none tracking-widest">
              Действия
            </th>
          </tr>
        </thead>

        <tbody
          className={`divide-y divide-gray-100 transition-opacity duration-200 ${
            isLoading && products.length > 0
              ? 'opacity-40 pointer-events-none'
              : ''
          }`}
        >
          {products.length === 0 && !isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-12 font-medium text-gray-800 text-sm text-center"
              >
                Продукты не найдены
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={product.id}
                className="group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200"
              >
                <td className="px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-2">
                  <div className="flex justify-center items-center bg-gray-50 border border-gray-100 group-hover:border-gray-200 rounded-md w-10 h-10 overflow-hidden transition-colors">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                </td>
                <td className="px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap">
                  {product.name}
                </td>
                <td className="px-6 py-2 whitespace-nowrap">
                  {product.category ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-50/50 px-2 py-0.5 border-blue-100 rounded font-medium text-[11px] text-blue-600"
                    >
                      {product.category.name}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-2 text-center whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    className="bg-purple-50/50 px-2 py-0.5 border-purple-100 rounded font-medium text-[11px] text-purple-600"
                  >
                    {product._count.productItems || 0}
                  </Badge>
                </td>
                <td className="px-6 py-2 text-center whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    className="bg-green-50/50 px-2 py-0.5 border-green-100 rounded font-medium text-[11px] text-green-600"
                  >
                    {product._count.ingredients || 0}
                  </Badge>
                </td>
                <td className="px-6 py-2 whitespace-nowrap">
                  <TableActions
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
