import { useEffect, useState } from 'react';

/**
 * A reusable hook for handling price input formatting and validation
 * Works with any object that has a numeric "price" property
 *
 * @param value - The current numeric price (e.g. from form or entity)
 * @param isOpen - Optional flag (like dialog open) to reset value when changed
 */
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

  /**
   * Handles input typing
   * Allows only valid decimal numbers up to 2 decimals
   */
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

    // Validate format: digits with optional decimal point (max 2 decimals)
    if (!/^\d*\.?\d{0,2}$/.test(input)) {
      return;
    }

    // Update local string state for live typing
    setPriceInput(input);

    // Update numeric value for form/validation
    const numValue = parseFloat(input);
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  /**
   * Handles blur event (format to 2 decimals if needed)
   */
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
