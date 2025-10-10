'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RequiredSymbol } from './required-symbol';
import { ClearButton } from './clear-button';
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
}

export function FormField({
  name,
  label,
  required,
  className,
  isPhone = false,
  isTextArea = false,
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
      <p className='font-medium mb-2'>
        {label} {required && <RequiredSymbol />}
      </p>
    ) : null;

  const Error = () =>
    errorText ? <ErrorText text={errorText} className='mt-2' /> : null;

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
              className='h-10 text-md'
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
        <div className='relative'>
          <Input
            {...register(name)}
            {...props}
            className={cn('h-10 text-md', className)}
          />
          {value && <ClearButton onClick={onClear} />}
        </div>
      )}

      <Error />
    </div>
  );
}
