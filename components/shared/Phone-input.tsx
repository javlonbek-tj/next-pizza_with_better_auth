'use client';

import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  className?: string;
}

export function PhoneInput({ value, onChange, error, className }: Props) {
  return (
    <div className="relative">
      {/* Prefix +998 */}
      <span className="top-1/2 left-3 absolute text-gray-500 text-sm -translate-y-1/2">
        +998
      </span>

      <IMaskInput
        mask="00 000-00-00"
        lazy={false}
        placeholder="__ ___-__-__"
        value={value}
        onAccept={(val) => onChange?.(val)}
        className={cn(
          // ✅ Use your exact shadcn input base styles
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
          'aria-invalid:outline-none aria-invalid:ring-2 aria-invalid:ring-destructive aria-invalid:ring-offset-0',
          'pl-14', // extra padding for the +998 prefix
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
      />
    </div>
  );
}
