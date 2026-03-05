'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, Check } from 'lucide-react';
import qs from 'qs';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, sortOptions } from '@/lib';

interface Props {
  className?: string;
}

export function SortPopup({ className }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const currentSort = params.get('sort') || 'default';

  const handleSortChange = (value: string) => {
    const currentParams = qs.parse(params.toString());
    const newParams = {
      ...currentParams,
      sort: value === 'default' ? undefined : value,
    };
    const query = qs.stringify(newParams, { skipNulls: true });

    router.push(`?${query}`, { scroll: false });
  };

  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label ??
    'По умолчанию';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 px-5 py-2.5 rounded-2xl outline-none font-medium text-sm transition-colors duration-200 cursor-pointer',
          className,
        )}
      >
        <ArrowUpDown size={16} className="text-gray-600" />
        <span className="text-gray-600">Сортировка:</span>
        <span className="font-semibold text-primary">{currentLabel}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="space-y-1 p-2 w-56"
        sideOffset={8}
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={cn(
              'flex justify-between items-center px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
              currentSort === option.value
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-gray-100',
            )}
          >
            <span>{option.label}</span>
            {currentSort === option.value && (
              <Check size={16} className="text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
