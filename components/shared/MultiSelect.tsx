import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Выберите...',
  disabled = false,
  className = '',
}: MultiSelectProps) {
  const handleSelect = (selectedValue: string) => {
    if (selectedValue === 'none') return;

    if (!value.includes(selectedValue)) {
      onChange([...value, selectedValue]);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((v) => v !== valueToRemove));
  };

  const availableOptions = options.filter((opt) => !value.includes(opt.value));
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div className='space-y-2'>
      <Select
        value='none'
        onValueChange={handleSelect}
        disabled={disabled || availableOptions.length === 0}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none' disabled>
            {availableOptions.length === 0 ? 'Все выбраны' : placeholder}
          </SelectItem>
          {availableOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedOptions.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant='secondary'
              className='px-2 py-1 cursor-pointer hover:bg-secondary/80'
            >
              {option.label}
              <button
                type='button'
                onClick={() => handleRemove(option.value)}
                disabled={disabled}
                className='ml-1 hover:text-destructive'
              >
                <X className='w-3 h-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
