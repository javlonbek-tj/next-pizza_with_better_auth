'use client';
import { createContext, useContext, ReactNode } from 'react';

interface FilterPendingContextType {
  isPending: boolean;
}

const FilterPendingContext = createContext<FilterPendingContextType>({
  isPending: false,
});

export const useFilterPending = () => useContext(FilterPendingContext);

export function FilterPendingProvider({
  children,
  isPending,
}: {
  children: ReactNode;
  isPending: boolean;
}) {
  return (
    <FilterPendingContext.Provider value={{ isPending }}>
      {children}
    </FilterPendingContext.Provider>
  );
}
