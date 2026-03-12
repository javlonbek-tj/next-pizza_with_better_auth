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
}

export function TableActions({ onEdit, onDelete, onView }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex justify-end items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onView}
              className="hover:bg-blue-50 text-blue-600 active:scale-95 transition-all cursor-pointer"
            >
              <Eye />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white">
            Ko&apos;rish
          </TooltipContent>
        </Tooltip>

        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onEdit}
                className="hover:bg-gray-100 text-gray-600 active:scale-95 transition-all cursor-pointer"
              >
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white">
              Tahrirlash
            </TooltipContent>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onDelete}
                className="hover:bg-red-50 text-red-600 active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="**:data-[slot=tooltip-arrow]:hidden bg-gray-900 shadow-xl px-2 py-1 border-none text-[10px] text-white">
              O&apos;chirish
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
