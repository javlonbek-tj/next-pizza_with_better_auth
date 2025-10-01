'use client';

import { useState } from 'react';
import { cn } from '@/lib';
import { Input } from '../ui/input';
import { FilterCheckbox } from './Filter-checkbox';

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

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newValues = new Set(values);
    if (checked) {
      newValues.add(id);
    } else {
      newValues.delete(id);
    }
    onClickCheckbox(id);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin',
        className
      )}
    >
      {/* Sticky header (title + search) */}
      <div className='sticky top-0 bg-white z-2 pb-2'>
        {title && <p className='text-md font-bold'>{title}:</p>}
        {showAll && options.length > limit && (
          <div className='mt-2 px-1'>
            <Input
              placeholder={searchInputPlaceholder}
              onChange={onChangeSearchInput}
            />
          </div>
        )}
      </div>

      {/* Options list */}
      <div className='flex flex-col gap-2'>
        {list.map((option) => (
          <FilterCheckbox
            key={option.label}
            label={option.label}
            value={option.value}
            checked={values.has(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
            name={name}
          />
        ))}

        {options.length > limit && !searchTerm && (
          <button
            className='text-sm text-primary cursor-pointer mt-2 self-start'
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Скрыть' : '+ Показать все'}
          </button>
        )}
      </div>
    </div>
  );
}
