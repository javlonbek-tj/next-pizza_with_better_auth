'use client';

import { use } from 'react';
import { TableActions } from '@/components/admin/table/TableActions';
import { PizzaSize, PizzaSizeWithProductCount } from '@/types';

interface Props {
  dataPromise: Promise<{ data: PizzaSizeWithProductCount[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onEdit: (size: PizzaSize) => void;
  onDelete: (id: string) => void;
}

export function PizzaSizeTableBody({
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
            colSpan={4}
            className='px-6 py-12 font-medium text-gray-800 text-sm text-center'
          >
            Размеры не найдены
          </td>
        </tr>
      ) : (
        data.map((size: PizzaSizeWithProductCount, index: number) => (
          <tr
            key={size.id}
            className='group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200'
          >
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {startIndex + index + 1}
            </td>
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {size.label}
            </td>
            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <span className='inline-flex items-center bg-amber-50/50 px-2 py-0.5 border border-amber-100 rounded font-medium text-[11px] text-amber-600'>
                {size.size} см
              </span>
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions
                onEdit={() => onEdit(size)}
                onDelete={() => onDelete(size.id)}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
