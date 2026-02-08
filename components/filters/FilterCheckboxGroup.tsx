'use client';

import { useState } from 'react';

import { cn } from '@/lib';
import { Input } from '../ui/input';
import { FilterCheckbox } from './FilterCheckbox';

interface Props {
  options: { label: string; value: string }[];
  values: Set<string>;
  onClickCheckbox: (id: string) => void;
  title: string;
  name: string;
  limit?: number;
  searchInputPlaceholder?: string;
  className?: string;
}

export function FilterCheckboxGroup({
  options,
  values,
  onClickCheckbox,
  name,
  title,
  limit = 5,
  searchInputPlaceholder = 'Поиск...',
  className,
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const list = showAll
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options.slice(0, limit);

  return (
    <div
      className={cn(
        'flex flex-col pr-2 max-h-96 overflow-y-auto scrollbar-thin',
        className
      )}
    >
      {/* Sticky header (title + search) */}
      <div className="top-0 z-2 sticky bg-white pb-2">
        {title && <h4 className="font-bold">{title}:</h4>}
        {showAll && options.length > limit && (
          <div className="mt-2 px-1">
            <Input
              placeholder={searchInputPlaceholder}
              onChange={onChangeSearchInput}
            />
          </div>
        )}
      </div>

      {/* Options list */}
      <div className="flex flex-col gap-2">
        {list.map((option) => (
          <FilterCheckbox
            key={option.label}
            label={option.label}
            value={option.value}
            checked={values.has(option.value)}
            onChange={() => onClickCheckbox(option.value)}
            name={name}
          />
        ))}

        {options.length > limit && !searchTerm && (
          <button
            className="self-start mt-2 text-primary text-sm cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Скрыть' : '+ Показать все'}
          </button>
        )}
      </div>
    </div>
  );
}
