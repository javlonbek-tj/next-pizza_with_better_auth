'use client';
import { cn } from '@/lib';
import { Title } from '../shared/Title';
import { FilterCheckboxGroup } from './FilterCheckboxGroup';
import { PriceRange } from './PriceRange';
import { DEFAULT_PRICE_FROM, DEFAULT_PRICE_TO } from '@/lib/constants';
import {
  useFilters,
  useGetIngredients,
  useGetPizzaSizes,
  usePizzaTypes,
  useQueryFilters,
} from '@/hooks';
import { FilterSkeleton } from '../skeletons/FiltersSkeleton';
import { FilterPendingProvider } from '@/context/FilterPendingContext';

interface Props {
  className?: string;
}

export function Filters({ className }: Props) {
<<<<<<< HEAD
  const filters = useFilters();

=======
>>>>>>> d6b396e0c68a01ed69935cbdca2ea0ddc93d2884
  const { data: ingredients = [], isPending: isIngredientsLoading } =
    useGetIngredients();
  const { data: pizzaSizeOptions = [], isPending: isSizesLoading } =
    useGetPizzaSizes();
  const { data: pizzaTypeOptions = [], isPending: isTypesLoading } =
    usePizzaTypes();

<<<<<<< HEAD
  const initialDataLoading =
    isIngredientsLoading || isSizesLoading || isTypesLoading;

  const { isPending } = useQueryFilters(filters);

  return (
    <FilterPendingProvider isPending={isPending}>
      <div className={cn('relative', className)}>
        <Title text='Фильтрация' size='sm' className='mb-5 font-bold' />
        {initialDataLoading ? (
          <FilterSkeleton />
        ) : (
          <div className=''>
            {pizzaTypeOptions.length > 0 && (
              <FilterCheckboxGroup
                options={pizzaTypeOptions.map((pizzaType) => ({
                  label: pizzaType.type,
                  value: pizzaType.id.toString(),
                }))}
                name='pizza-type'
                title='Тип теста'
                className='mb-5'
                values={filters.pizzaTypes}
                onClickCheckbox={filters.togglePizzaType}
              />
            )}

            {pizzaSizeOptions.length > 0 && (
              <FilterCheckboxGroup
                options={pizzaSizeOptions.map((pizzaSize) => ({
                  label: `${pizzaSize.size} см`,
                  value: pizzaSize.size.toString(),
                }))}
                name='pizza-size'
                title='Размеры'
                className='mb-5'
                values={filters.pizzaSize}
                onClickCheckbox={filters.togglePizzaSize}
              />
            )}

            <PriceRange
              className='pt-4 mb-6 border-t border-b border-gray-200 pb-7'
              title='Цены от и до'
              min={DEFAULT_PRICE_FROM}
              max={DEFAULT_PRICE_TO}
              step={10}
              value={[
                filters.prices.priceFrom ?? DEFAULT_PRICE_FROM,
                filters.prices.priceTo ?? DEFAULT_PRICE_TO,
              ]}
              onValueChange={filters.togglePrices}
=======
  const isDataLoading =
    isSizesLoading || isTypesLoading || isIngredientsLoading;

  return (
    <div className={cn('relative', className)}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {isDataLoading ? (
        <FilterSkeleton />
      ) : (
        <div className="">
          {/* ---------- Pizza Types ---------- */}
          {pizzaTypeOptions.length > 0 && (
            <FilterCheckboxGroup
              options={pizzaTypeOptions.map((pizzaType) => ({
                label: pizzaType.type,
                value: pizzaType.id.toString(),
              }))}
              name="pizza-type"
              title="Тип теста"
              className="mb-5"
              values={filters.pizzaTypes}
              onClickCheckbox={filters.togglePizzaType}
>>>>>>> d6b396e0c68a01ed69935cbdca2ea0ddc93d2884
            />

<<<<<<< HEAD
            {ingredients.length > 0 && (
              <FilterCheckboxGroup
                options={ingredients.map((ingredient) => ({
                  label: ingredient.name,
                  value: ingredient.id,
                }))}
                name='ingredients'
                title='Ингредиенты'
                limit={6}
                className='mb-5'
                values={filters.ingredientsIds}
                onClickCheckbox={filters.toggleIngredient}
              />
            )}
          </div>
        )}
      </div>
    </FilterPendingProvider>
=======
          {/* ---------- Pizza Sizes ---------- */}
          {pizzaSizeOptions.length > 0 && (
            <FilterCheckboxGroup
              options={pizzaSizeOptions.map((pizzaSize) => ({
                label: `${pizzaSize.size.toString()}  см`,
                value: pizzaSize.size.toString(),
              }))}
              name="pizza-size"
              title="Размеры"
              className="mb-5"
              values={filters.pizzaSize}
              onClickCheckbox={filters.togglePizzaSize}
            />
          )}

          {/* ---------- Price Range ---------- */}
          <PriceRange
            className="mb-6 pt-4 pb-7 border-gray-200 border-t border-b"
            title="Цены от и до"
            min={DEFAULT_PRICE_FROM}
            max={DEFAULT_PRICE_TO}
            step={10}
            value={[
              filters.prices.priceFrom ?? DEFAULT_PRICE_FROM,
              filters.prices.priceTo ?? DEFAULT_PRICE_TO,
            ]}
            onValueChange={filters.togglePrices}
          />

          {/* ---------- Ingredients ---------- */}
          {ingredients.length > 0 && (
            <FilterCheckboxGroup
              options={ingredients.map((ingredient) => ({
                label: ingredient.name,
                value: ingredient.id,
              }))}
              name="ingredients"
              title="Ингредиенты"
              limit={6}
              className="mb-5"
              values={filters.ingredientsIds}
              onClickCheckbox={filters.toggleIngredient}
            />
          )}
        </div>
      )}
    </div>
>>>>>>> d6b396e0c68a01ed69935cbdca2ea0ddc93d2884
  );
}
