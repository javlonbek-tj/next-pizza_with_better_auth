'use client';

import { cn } from '@/lib';
import { Title } from '../shared/Title';
import { FilterCheckboxGroup } from './FilterCheckboxGroup';
import { PriceRange } from './PriceRange';
import { DEFAULT_PRICE_FROM, DEFAULT_PRICE_TO } from '@/lib/constants';
import { useFilters, useQueryFilters } from '@/hooks';
import { useIngredients } from '@/hooks';
import { FilterLoading } from './FilterLoading';

interface Props {
  className?: string;
}

export function Filters({ className }: Props) {
  const filters = useFilters();

  const { isPending } = useQueryFilters(filters);

  const {
    options,
    isPending: isIngredientsLoading,
    isError,
  } = useIngredients();

  return (
    <div className={cn('relative', className)}>
      {isPending && <FilterLoading />}

      <Title text='Фильтрация' size='sm' className='mb-5 font-bold' />

      <FilterCheckboxGroup
        options={[
          { label: 'Тонкое', value: '1' },
          { label: 'Традиционное', value: '2' },
        ]}
        name='pizza-type'
        title='Тип теста'
        className='mb-5'
        values={filters.pizzaTypes}
        onClickCheckbox={filters.togglePizzaType}
      />

      <FilterCheckboxGroup
        options={[
          { label: '30 см', value: '30' },
          { label: '40 см', value: '40' },
          { label: '50 см', value: '50' },
        ]}
        name='pizza-size'
        title='Размеры'
        className='mb-5'
        values={filters.pizzaSize}
        onClickCheckbox={filters.togglePizzaSize}
      />

      <PriceRange
        className='mb-6 pt-4 pb-7 border-gray-200 border-t border-b'
        title='Цены от и до'
        min={DEFAULT_PRICE_FROM}
        max={DEFAULT_PRICE_TO}
        step={10}
        value={[
          filters.prices.priceFrom || DEFAULT_PRICE_FROM,
          filters.prices.priceTo || DEFAULT_PRICE_TO,
        ]}
        onValueChange={filters.togglePrices}
      />

      {!isIngredientsLoading && !isError && options.length > 0 && (
        <FilterCheckboxGroup
          options={options}
          name='ingredients'
          title='Ингредиенты'
          limit={6}
          className='mb-5'
          values={filters.ingredientsIds}
          onClickCheckbox={filters.toggleIngredient}
        />
      )}

      {isIngredientsLoading && (
        <div className='mb-5'>
          <Title text='Ингредиенты' size='sm' className='mb-3 font-bold' />
          <div className='animate-pulse space-y-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-6 bg-gray-200 rounded' />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div className='mb-5'>
          <Title text='Ингредиенты' size='sm' className='mb-3 font-bold' />
          <p className='text-gray-500 text-sm'>Ошибка загрузки ингредиентов</p>
        </div>
      )}
    </div>
  );
}
