import { useEffect, useState } from 'react';

export function useNumberInput(initialValue: string = '', open?: boolean) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? '');
    }
  }, [open, initialValue]);

  const handleChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setValue(value);
    }
  };

  const handleBlur = (onExternalChange: (value: number) => void) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setValue(String(num));
      onExternalChange(num);
    }
  };

  return { value, onChange: handleChange, onBlur: handleBlur };
}
