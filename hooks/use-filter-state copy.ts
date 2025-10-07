import { useCallback, useEffect, useState, useTransition, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import qs from 'qs';
import { DEFAULT_PRICE_FROM, DEFAULT_PRICE_TO } from '@/lib/constants';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

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

  const updateURL = useCallback(() => {
    const currentParams = Object.fromEntries(searchParams.entries());

    const newParams: Record<string, string | number | undefined> = {
      ...currentParams,
    };

    if (ingredientsIds.size > 0) {
      newParams['ingredients'] = Array.from(ingredientsIds).join(',');
    } else {
      delete newParams['ingredients'];
    }

    if (pizzaTypes.size > 0) {
      newParams['pizzaTypes'] = Array.from(pizzaTypes).join(',');
    } else {
      delete newParams['pizzaTypes'];
    }

    if (pizzaSize.size > 0) {
      newParams['pizzaSize'] = Array.from(pizzaSize).join(',');
    } else {
      delete newParams['pizzaSize'];
    }

    if (prices.priceFrom && prices.priceFrom !== DEFAULT_PRICE_FROM) {
      newParams['priceFrom'] = prices.priceFrom;
    } else {
      delete newParams['priceFrom'];
    }

    if (prices.priceTo && prices.priceTo !== DEFAULT_PRICE_TO) {
      newParams['priceTo'] = prices.priceTo;
    } else {
      delete newParams['priceTo'];
    }

    const query = qs.stringify(newParams, { skipNulls: true });

    if (isInitialMount.current) {
      isInitialMount.current = false;
      router.push(`?${query}`, { scroll: false });
    } else {
      startTransition(() => {
        router.push(`?${query}`, { scroll: false });
      });
    }
  }, [ingredientsIds, pizzaTypes, pizzaSize, prices, router, searchParams]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const handlePriceChange = useCallback((value: [number, number]) => {
    setPrices({
      priceFrom: value[0] === DEFAULT_PRICE_FROM ? undefined : value[0],
      priceTo: value[1] === DEFAULT_PRICE_TO ? undefined : value[1],
    });
  }, []);

  return {
    ingredientsIds,
    toggleIngredient,
    pizzaTypes,
    togglePizzaType,
    pizzaSize,
    togglePizzaSize,
    prices,
    handlePriceChange,
    isPending: isPending && !isInitialMount.current,
  };
}
