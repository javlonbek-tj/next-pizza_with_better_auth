'use client';

import { queryKeys } from '@/constants';
import { Ingredient } from '@/generated/prisma/client';
import { getAll } from '@/services/ingredients';
import { useQuery } from '@tanstack/react-query';

export const useIngredients = () => {
  const {
    data = [],
    isPending,
    isError,
  } = useQuery<Ingredient[]>({
    queryKey: queryKeys.ingredients,
    queryFn: getAll,
  });

  const options = data.map((item) => ({
    label: item.name,
    value: String(item.id),
  }));

  return { options, isPending, isError };
};
