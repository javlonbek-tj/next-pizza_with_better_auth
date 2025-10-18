// hooks/admin/use-ingredients.ts
import { useQuery } from '@tanstack/react-query';

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const res = await fetch('/api/ingredients');
      if (!res.ok) throw new Error('Failed to fetch ingredients');
      return res.json();
    },
  });
}
