
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useTransition } from 'react';
import { useDebounce } from 'react-use';
import qs from 'qs';
import { Filters } from './use-filters';

export const useQueryFilters = (filters: Filters) => {
  const isInitialMount = useRef(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(() => {
    const currentParams = Object.fromEntries(searchParams.entries());

    const newParams = {
      ...currentParams,
      ...filters.prices,
      pizzaTypes: Array.from(filters.pizzaTypes),
      pizzaSize: Array.from(filters.pizzaSize),
      ingredients: Array.from(filters.ingredientsIds),
    };

    const newQuery = qs.stringify(newParams, {
      skipNulls: true,
      arrayFormat: 'comma',
    });

    const currentQuery = searchParams.toString();
    if (newQuery === currentQuery) {
      isInitialMount.current = false;
      return;
    }

    const push = () => router.push(`?${newQuery}`, { scroll: false });

    if (isInitialMount.current) {
      isInitialMount.current = false;
      push();
    } else {
      startTransition(push);
    }
  }, [filters, router, searchParams, startTransition]);

  useDebounce(
    () => {
      updateUrl();
    },
    300,
    [updateUrl]
  );

  return { isPending: isPending && !isInitialMount.current };
};
