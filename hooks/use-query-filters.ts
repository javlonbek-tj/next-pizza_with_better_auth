import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useTransition } from 'react';
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

    // Only update if the query actually changed
    if (newQuery === currentQuery) {
      isInitialMount.current = false;
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      router.push(`?${newQuery}`, { scroll: false });
    } else {
      startTransition(() => {
        router.push(`?${newQuery}`, { scroll: false });
      });
    }
  }, [filters, router, searchParams, startTransition]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl, filters]);

  return { isPending: isPending && !isInitialMount.current };
};
