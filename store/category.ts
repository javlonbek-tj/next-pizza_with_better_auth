import { create } from 'zustand';

interface CategoryState {
  activeId: string;
  setActiveId: (activeId: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  activeId: '1',
  setActiveId: (activeId: string) => set({ activeId }),
}));
