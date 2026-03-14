'use client';

import { use } from 'react';
import Image from 'next/image';
import { TableActions } from '@/components/admin/table/TableActions';
import { Ingredient } from '@/types';

interface Props {
  dataPromise: Promise<{ data: Ingredient[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string) => void;
}

export function IngredientsTableBody({
  dataPromise,
  startIndex,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const { data: ingredients } = use(dataPromise);

  return (
    <tbody
      className={`divide-y divide-gray-100 transition-opacity duration-200 ${
        isLoading && ingredients.length > 0 ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {ingredients.length === 0 ? (
        <tr>
          <td
            colSpan={5}
            className='px-6 py-12 font-medium text-gray-800 text-sm text-center'
          >
            Ингредиенты не найдены
          </td>
        </tr>
      ) : (
        ingredients.map((ingredient: Ingredient, index: number) => (
          <tr
            key={ingredient.id}
            className='group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200'
          >
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {startIndex + index + 1}
            </td>
            <td className='px-6 py-2'>
              <div className='flex justify-center items-center bg-gray-50 border border-gray-100 group-hover:border-gray-200 rounded-md w-10 h-10 overflow-hidden transition-colors'>
                <Image
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  width={36}
                  height={36}
                  className='object-contain'
                />
              </div>
            </td>
            <td className='px-6 py-2 font-bold text-gray-600 text-xs whitespace-nowrap'>
              {ingredient.name}
            </td>
            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <span className='inline-flex items-center gap-1 bg-green-50/50 px-2 py-0.5 border border-green-100 rounded font-medium text-[11px] text-green-600'>
                {ingredient.price.toLocaleString('ru-RU')} ₽
              </span>
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions
                onEdit={() => onEdit(ingredient)}
                onDelete={() => onDelete(ingredient.id)}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
