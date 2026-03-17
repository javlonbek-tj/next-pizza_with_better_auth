import { cn } from '@/lib';
import { Checkbox } from '../ui/checkbox';

interface Props {
  className?: string;
  label: string;
  value: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FilterCheckbox({
  className,
  label,
  value,
  name,
  checked,
  onChange,
}: Props) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Checkbox
        id={`checkbox-${String(name)}-${String(value)}`}
        className='w-5 h-5 rounded-[4px]'
        value={value}
        checked={checked}
        onCheckedChange={onChange}
      />
      <label
        htmlFor={`checkbox-${String(name)}-${String(value)}`}
        className='flex-1 text-sm font-medium cursor-pointer'
      >
        {label}
      </label>
    </div>
  );
}
