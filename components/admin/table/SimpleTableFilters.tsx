'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Props {
  search: string;
  handleSearch: (value: string) => void;
  placeholder?: string;
}

export function SimpleTableFilters({
  search,
  handleSearch,
  placeholder = 'Найти...',
}: Props) {
  return (
    <div className="relative flex items-center gap-3 p-4 border-b">
      <div className="relative flex-1 max-w-sm">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
        <Input
          placeholder={placeholder}
          className="shadow-xs pl-9 h-9 text-xs 2xl:text-sm"
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
