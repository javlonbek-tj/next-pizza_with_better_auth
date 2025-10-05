import { create } from 'zustand';

interface CategoryState {
  activeName: string;
  setActiveName: (name: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  activeName: 'Пиццы',
  setActiveName: (activeName: string) => set({ activeName }),
}));
