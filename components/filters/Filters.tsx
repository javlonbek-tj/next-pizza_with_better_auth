'use client';
import { cn } from '@/lib';
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

interface Props {
  className?: string;
}

export function Filters({ className }: Props) {
  const filters = useFilters();

  const { data: ingredients = [], isPending: isIngredientsLoading } =
    useGetIngredients();
  const { data: pizzaSizeOptions = [], isPending: isSizesLoading } =
    useGetPizzaSizes();
  const { data: pizzaTypeOptions = [], isPending: isTypesLoading } =
    usePizzaTypes();

  const initialDataLoading =
    isIngredientsLoading || isSizesLoading || isTypesLoading;

  useQueryFilters(filters);

  return (
    <div className={cn('relative', className)}>
      <h2 className="mb-5 font-bold text-xl">Фильтры</h2>

      {initialDataLoading ? (
        <FilterSkeleton />
      ) : (
        <div className="">
          {/* ----- Pizza Types ----- */}
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
            />
          )}

          {/* ----- Pizza Sizes ----- */}
          {pizzaSizeOptions.length > 0 && (
            <FilterCheckboxGroup
              options={pizzaSizeOptions.map((pizzaSize) => ({
                label: `${pizzaSize.size} см`,
                value: pizzaSize.size.toString(),
              }))}
              name="pizza-size"
              title="Размеры"
              className="mb-5"
              values={filters.pizzaSize}
              onClickCheckbox={filters.togglePizzaSize}
            />
          )}

          {/* ----- Price Range ----- */}
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

          {/* ----- Ingredients ----- */}
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
  );
}
