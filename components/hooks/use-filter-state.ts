import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import qs from 'qs';
import { DEFAULT_PRICE_FROM, DEFAULT_PRICE_TO } from '@/constants';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export function useFilterState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
    const params: Record<string, string | number | undefined> = {};

    if (ingredientsIds.size > 0) {
      params['ingredients'] = Array.from(ingredientsIds).join(',');
    }
    if (pizzaTypes.size > 0) {
      params['pizzaTypes'] = Array.from(pizzaTypes).join(',');
    }
    if (pizzaSize.size > 0) {
      params['pizzaSize'] = Array.from(pizzaSize).join(',');
    }
    if (prices.priceFrom && prices.priceFrom !== DEFAULT_PRICE_FROM) {
      params['priceFrom'] = prices.priceFrom;
    }
    if (prices.priceTo && prices.priceTo !== DEFAULT_PRICE_TO) {
      params['priceTo'] = prices.priceTo;
    }

    const query = qs.stringify(params, { skipNulls: true });

    startTransition(() => {
      router.push(`?${query}`, { scroll: false });
    });
  }, [ingredientsIds, pizzaTypes, pizzaSize, prices, router]);

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
    isPending,
  };
}
