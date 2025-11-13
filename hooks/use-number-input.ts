import { useEffect, useState } from 'react';
import { PizzaSize } from '@/lib/generated/prisma';

export function useNumberInput(
  pizzaSize: PizzaSize | null | undefined,
  open: boolean
) {
  const [sizeInput, setSizeInput] = useState('');

  useEffect(() => {
    if (pizzaSize) {
      setSizeInput(pizzaSize.size.toString());
    } else {
      setSizeInput('');
    }
  }, [pizzaSize, open]);

  const handleSizeChange = (
    value: string,
    onChange: (value: number) => void
  ) => {
    // Allow only digits (no decimals, no negatives)
    if (!/^\d+$/.test(value)) {
      return;
    }

    setSizeInput(value);

    // Parse to number for Zod validation
    const numValue = parseInt(value, 10);
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  const handleSizeBlur = (onChange: (value: number) => void) => {
    const numValue = parseInt(sizeInput, 10);
    if (!isNaN(numValue)) {
      setSizeInput(numValue.toString());
      onChange(numValue);
    }
  };

  return {
    sizeInput,
    handleSizeChange,
    handleSizeBlur,
  };
}
