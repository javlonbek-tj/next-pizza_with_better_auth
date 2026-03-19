'use client';

import { use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { TableActions } from '@/components/admin/table/TableActions';
import type { Product } from '@/types';

interface Props {
  productsPromise: Promise<{ data: Product[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTableBody({
  productsPromise,
  startIndex,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const { data: products } = use(productsPromise);
  const router = useRouter();

  return (
    <tbody
      className={`divide-y divide-gray-100 transition-opacity duration-200 ${
        isLoading && products.length > 0 ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {products.length === 0 ? (
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
                onView={() => router.push(`/admin/products/${product.id}`)}
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product.id)}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
