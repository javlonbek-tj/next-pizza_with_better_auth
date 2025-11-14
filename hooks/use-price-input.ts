import { useState } from 'react';

export function usePriceInput(initialValue: string = '') {
  const [priceInput, setPriceInput] = useState<string>(initialValue);

  const handlePriceChange = (input: string) => {
    // Normalize comma to dot
    const normalized = input.replace(',', '.');

    // Allow empty or valid decimal with up to 2 decimals
    if (normalized === '' || /^\d*\.?\d{0,2}$/.test(normalized)) {
      setPriceInput(normalized);
    }
    // Otherwise, ignore invalid input (prevents typing bad chars)
  };

  const handlePriceBlur = (onChange: (value: number | null) => void) => {
    if (priceInput === '') {
      setPriceInput('');
      onChange(null);
      return;
    }

    const numValue = parseFloat(priceInput);
    if (!isNaN(numValue)) {
      const formatted = numValue.toFixed(2);
      setPriceInput(formatted);
      onChange(parseFloat(formatted));
    } else {
      setPriceInput('');
      onChange(null);
    }
  };

  return { priceInput, setPriceInput, handlePriceChange, handlePriceBlur };
}
