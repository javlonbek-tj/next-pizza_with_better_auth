import { create } from 'zustand';

interface CheckoutState {
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useCheckoutState = create<CheckoutState>((set) => ({
  isProcessing: false,
  setIsProcessing: (isProcessing) => set({ isProcessing }),
}));
