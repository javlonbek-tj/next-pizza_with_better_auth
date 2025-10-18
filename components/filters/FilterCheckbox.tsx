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
        className='rounded-[8px] w-6 h-6'
        value={value}
        checked={checked}
        onCheckedChange={onChange}
      />
      <label
        htmlFor={`checkbox-${String(name)}-${String(value)}`}
        className='text-md font-medium cursor-pointer flex-1'
      >
        {label}
      </label>
    </div>
  );
}
