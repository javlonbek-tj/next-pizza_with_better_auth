'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RequiredSymbol } from './RequiredSymbol';
import { ClearButton } from './ClearButton';
import { ErrorText, PhoneInput } from '../shared';
import { cn } from '@/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  type?: string;
  isPhone?: boolean;
  isTextArea?: boolean;
  hasClearBtn?: boolean;
  suffix?: React.ReactNode;
}

export function FormField({
  name,
  label,
  required,
  className,
  isPhone = false,
  isTextArea = false,
  hasClearBtn = true,
  suffix,
  ...props
}: Props) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string | undefined;

  const onClear = () => setValue(name, '', { shouldValidate: true });

  const Label = () =>
    label ? (
      <p className="mb-2 font-medium">
        {label} {required && <RequiredSymbol />}
      </p>
    ) : null;

  const Error = () =>
    errorText ? <ErrorText text={errorText} className="mt-2" /> : null;

  return (
    <div className={className}>
      <Label />

      {isPhone ? (
        // Phone Input (controlled)
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <PhoneInput
              value={field.value || ''}
              onChange={(val) => field.onChange(val)}
              error={!!errorText}
              className="h-10 text-md"
            />
          )}
        />
      ) : isTextArea ? (
        // Textarea
        <Textarea
          {...register(name)}
          className={cn('min-h-[100px] text-md resize-none', className)}
        />
      ) : (
        // Regular Input
        <div className="relative">
          <Input
            {...register(name)}
            {...props}
            className={cn('pr-20 h-10 text-md', className)}
          />

          {/* Clear button */}
          {value && !suffix && hasClearBtn && <ClearButton onClick={onClear} />}

          {/* Suffix area — clickable */}
          {suffix && (
            <div
              className={cn(
                'top-1/2 right-2 absolute -translate-y-1/2',
                'pointer-events-auto'
              )}
            >
              {suffix}
            </div>
          )}
        </div>
      )}

      <Error />
    </div>
  );
}
