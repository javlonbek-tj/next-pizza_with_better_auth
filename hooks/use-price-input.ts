import { useEffect, useState } from 'react';

export function usePriceInput(
  value: number | null | undefined,
  isOpen: boolean
) {
  const [priceInput, setPriceInput] = useState<string>('');

  // Sync external value (e.g. from form or db)
  useEffect(() => {
    if (typeof value === 'number' && !isNaN(value)) {
      setPriceInput(value.toString());
    } else {
      setPriceInput('');
    }
  }, [value, isOpen]);

  const handlePriceChange = (
    input: string,
    onChange: (num: number) => void
  ) => {
    // Allow empty string
    if (input === '') {
      setPriceInput('');
      onChange(0);
      return;
    }

    if (!/^\d*\.?\d{0,2}$/.test(input)) {
      return;
    }

    setPriceInput(input);

    const numValue = parseFloat(input);
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  const handlePriceBlur = (onChange: (num: number) => void) => {
    if (priceInput === '' || priceInput === '.') {
      setPriceInput('');
      onChange(0);
      return;
    }

    const numValue = parseFloat(priceInput);
    if (!isNaN(numValue)) {
      const formatted = priceInput.includes('.')
        ? numValue.toFixed(2)
        : numValue.toString();

      setPriceInput(formatted);
      onChange(parseFloat(formatted));
    }
  };

  return { priceInput, handlePriceChange, handlePriceBlur };
}
