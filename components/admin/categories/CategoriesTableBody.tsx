'use client';

import { use } from 'react';
import { TableActions } from '@/components/admin/table/TableActions';
import { Badge } from '@/components/ui/badge';
import { Category, CategoryWithProductCount } from '@/types';

interface Props {
  dataPromise: Promise<{ data: CategoryWithProductCount[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoriesTableBody({
  dataPromise,
  startIndex,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const { data } = use(dataPromise);

  return (
    <tbody
      className={`divide-y divide-gray-100 transition-opacity duration-200 ${
        isLoading && data.length > 0 ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={5}
            className='px-6 py-12 font-medium text-gray-800 text-sm text-center'
          >
            Категории не найдены
          </td>
        </tr>
      ) : (
        data.map((category: CategoryWithProductCount, index: number) => (
          <tr
            key={category.id}
            className='group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200'
          >
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {startIndex + index + 1}
            </td>
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {category.name}
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <code className='bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600 text-xs'>
                {category.slug}
              </code>
            </td>
            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <Badge
                variant='secondary'
                className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                  category._count?.products > 0
                    ? 'bg-violet-50/50 border-violet-100 text-violet-600'
                    : 'bg-gray-50 border-gray-100 text-gray-500'
                }`}
              >
                {category._count?.products || 0}
              </Badge>
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions
                onEdit={() => onEdit(category)}
                onDelete={() => onDelete(category.id)}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
