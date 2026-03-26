'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  deleteDisabled?: boolean;
}

export function TableActions({ onEdit, onDelete, onView, deleteDisabled }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={`flex items-center justify-end gap-1 ${onView ? '' : 'pr-5'}`}
      >
        {onView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-xs'
                onClick={onView}
                className='text-blue-600 transition-all cursor-pointer hover:bg-blue-50 active:scale-95'
              >
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white'>
              Ko&apos;rish
            </TooltipContent>
          </Tooltip>
        )}

        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-xs'
                onClick={onEdit}
                className='text-gray-600 transition-all cursor-pointer hover:bg-gray-100 active:scale-95'
              >
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white'>
              Tahrirlash
            </TooltipContent>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon-xs'
                onClick={onDelete}
                disabled={deleteDisabled}
                className='text-red-600 transition-all cursor-pointer hover:bg-red-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none'
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            {deleteDisabled ? (
              <TooltipContent className='**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white'>
                Нельзя удалить себя
              </TooltipContent>
            ) : (
              <TooltipContent className='**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white'>
                O&apos;chirish
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
