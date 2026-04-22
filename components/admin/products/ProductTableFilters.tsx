'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryListItem } from '@/types';

interface Props {
  search: string;
  handleSearch: (value: string) => void;
  categories: CategoryListItem[];
  categoryId: string;
  handleFilterChange: (key: string, value: string) => void;
}

export function ProductTableFilters({
  search,
  handleSearch,
  categories,
  categoryId,
  handleFilterChange,
}: Props) {
  return (
    <div className="relative flex flex-wrap items-center gap-3 p-4 border-b">
      <Input
        placeholder="Найти продукт..."
        className="shadow-sm w-52 2xl:w-64 h-8 2xl:h-9"
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
        autoComplete="off"
      />
      <Select
        value={categoryId}
        onValueChange={(value) => handleFilterChange('categoryId', value)}
      >
        <SelectTrigger className="shadow-sm w-52" size="sm">
          <SelectValue
            placeholder="Фильтр по категории"
            className="text-xs 2xl:text-sm"
          />
        </SelectTrigger>
        <SelectContent className="dark:text-white">
          <SelectItem value="all" className="text-xs 2xl:text-sm">
            Все категории
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="text-xs 2xl:text-sm"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
