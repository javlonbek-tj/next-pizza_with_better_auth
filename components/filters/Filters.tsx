'use client';

import { cn } from '@/lib';
import { Title } from '../shared/Title';
import { FilterCheckboxGroup } from './Filter-checkbox-group';
import { PriceRange } from './Price-range';
import { DEFAULT_PRICE_FROM, DEFAULT_PRICE_TO } from '@/constants';
import { useFilterState } from '../hooks';
import { useIngredients } from '../hooks';
import { FilterLoading } from './Filter-loading';

interface Props {
  className?: string;
}

export function Filters({ className }: Props) {
  const {
    ingredientsIds,
    toggleIngredient,
    pizzaTypes,
    togglePizzaType,
    pizzaSize,
    togglePizzaSize,
    prices,
    handlePriceChange,
    isPending,
  } = useFilterState();

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
        values={pizzaTypes}
        onClickCheckbox={togglePizzaType}
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
        values={pizzaSize}
        onClickCheckbox={togglePizzaSize}
      />

      <PriceRange
        className='mb-6 pt-4 pb-7 border-gray-200 border-t border-b'
        title='Цены от и до'
        min={DEFAULT_PRICE_FROM}
        max={DEFAULT_PRICE_TO}
        step={10}
        value={[
          prices.priceFrom || DEFAULT_PRICE_FROM,
          prices.priceTo || DEFAULT_PRICE_TO,
        ]}
        onValueChange={handlePriceChange}
      />

      {!isIngredientsLoading && !isError && options.length > 0 && (
        <FilterCheckboxGroup
          options={options}
          name='ingredients'
          title='Ингредиенты'
          limit={6}
          className='mb-5'
          values={ingredientsIds}
          onClickCheckbox={toggleIngredient}
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
