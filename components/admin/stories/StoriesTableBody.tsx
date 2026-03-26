'use client';

import { use } from 'react';
import Image from 'next/image';
import { TableActions } from '@/components/admin/table/TableActions';
import { Badge } from '@/components/ui/badge';
import type { IStory } from '@/types';

interface Props {
  dataPromise: Promise<{ data: IStory[]; total: number }>;
  startIndex: number;
  isLoading: boolean;
  onEdit: (story: IStory) => void;
  onDelete: (id: string) => void;
  onPreview: (story: IStory) => void;
}

export function StoriesTableBody({
  dataPromise,
  startIndex,
  isLoading,
  onEdit,
  onDelete,
  onPreview,
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
            colSpan={6}
            className='px-6 py-12 text-sm font-medium text-center text-gray-800'
          >
            Истории не найдены
          </td>
        </tr>
      ) : (
        data.map((story: IStory, index: number) => (
          <tr
            key={story.id}
            className='transition-all duration-200 group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white'
          >
            <td className='px-6 py-2 text-xs font-bold text-gray-600 whitespace-nowrap'>
              {startIndex + index + 1}
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <button
                type='button'
                onClick={() => story.items.length > 0 && onPreview(story)}
                className='relative block w-10 overflow-hidden bg-gray-100 rounded cursor-pointer h-14 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group/preview'
                title={
                  story.items.length > 0
                    ? 'Нажмите, чтобы просмотреть историю'
                    : 'Нет слайдов'
                }
              >
                <div className='absolute inset-0 transition-transform duration-200 group-hover/preview:scale-110'>
                  <Image
                    src={story.previewImageUrl}
                    alt='Story preview'
                    fill
                    className='object-cover'
                    sizes='40px'
                  />
                </div>
                {story.items.length > 0 && (
                  <div className='absolute inset-0 flex items-center justify-center transition-colors duration-200 bg-black/0 group-hover/preview:bg-black/20'>
                    <span className='text-white text-[10px] font-bold opacity-0 group-hover/preview:opacity-100 transition-opacity'>
                      ▶
                    </span>
                  </div>
                )}
              </button>
            </td>
            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <Badge
                variant='secondary'
                className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                  story.items.length > 0
                    ? 'bg-violet-50/50 border-violet-100 text-violet-600'
                    : 'bg-gray-50 border-gray-100 text-gray-500'
                }`}
              >
                {story.items.length}
              </Badge>
            </td>
            <td className='px-6 py-2 text-xs text-gray-500 whitespace-nowrap'>
              {new Date(story.createdAt).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions
                onEdit={() => onEdit(story)}
                onDelete={() => onDelete(story.id.toString())}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
