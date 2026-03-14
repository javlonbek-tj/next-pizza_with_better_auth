'use client';

import { use } from 'react';
import { TableActions } from '@/components/admin/table/TableActions';
import { PizzaType, PizzaTypeWithProductCount } from '@/types';

interface Props {
  dataPromise: Promise<{ data: PizzaTypeWithProductCount[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onEdit: (type: PizzaType) => void;
  onDelete: (id: string) => void;
}

export function PizzaTypeTableBody({
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
            colSpan={3}
            className='px-6 py-12 font-medium text-gray-800 text-sm text-center'
          >
            Типы пицц не найдены
          </td>
        </tr>
      ) : (
        data.map((type: PizzaTypeWithProductCount, index: number) => (
          <tr
            key={type.id}
            className='group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200'
          >
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {startIndex + index + 1}
            </td>
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {type.type}
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions
                onEdit={() => onEdit(type)}
                onDelete={() => onDelete(type.id)}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
