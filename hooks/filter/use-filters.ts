'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import { DEFAULT_PRICE_FROM, DEFAULT_PRICE_TO } from '@/lib/constants';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export interface Filters {
  pizzaSize: Set<string>;
  pizzaTypes: Set<string>;
  ingredientsIds: Set<string>;
  prices: PriceProps;
}

interface ReturnProps extends Filters {
  togglePrices: (value: [number, number]) => void;
  togglePizzaType: (value: string) => void;
  togglePizzaSize: (value: string) => void;
  toggleIngredient: (value: string) => void;
}

export function useFilters(): ReturnProps {
  const searchParams = useSearchParams();

  const [ingredientsIds, { toggle: toggleIngredient }] = useSet(
    new Set<string>(
      searchParams.get('ingredients')?.split(',').filter(Boolean) || []
    )
  );

  const [pizzaTypes, { toggle: togglePizzaType }] = useSet(
    new Set<string>(
      searchParams.get('pizzaTypes')?.split(',').filter(Boolean) || []
    )
  );

  const [pizzaSize, { toggle: togglePizzaSize }] = useSet(
    new Set<string>(
      searchParams.get('pizzaSize')?.split(',').filter(Boolean) || []
    )
  );

  const [prices, setPrices] = useState<PriceProps>({
    priceFrom: searchParams.get('priceFrom')
      ? Number(searchParams.get('priceFrom'))
      : undefined,
    priceTo: searchParams.get('priceTo')
      ? Number(searchParams.get('priceTo'))
      : undefined,
  });

  const togglePrices = useCallback((value: [number, number]) => {
    setPrices({
      priceFrom: value[0] === DEFAULT_PRICE_FROM ? undefined : value[0],
      priceTo: value[1] === DEFAULT_PRICE_TO ? undefined : value[1],
    });
  }, []);

  return useMemo(
    () => ({
      ingredientsIds,
      toggleIngredient,
      pizzaTypes,
      togglePizzaType,
      pizzaSize,
      togglePizzaSize,
      prices,
      togglePrices,
    }),
    [
      ingredientsIds,
      toggleIngredient,
      pizzaTypes,
      togglePizzaType,
      pizzaSize,
      togglePizzaSize,
      prices,
      togglePrices,
    ]
  );
}
