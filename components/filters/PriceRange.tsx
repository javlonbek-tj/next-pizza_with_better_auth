'use client';
import { cn } from '@/lib';
import { Slider } from '../ui/slider';
import { DecimalInput } from '../shared';

interface Props {
  className?: string;
  title?: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export function PriceRange({
  className,
  title,
  min,
  max,
  step,
  value,
  onValueChange,
}: Props) {
  const [minValue, maxValue] = value;

  const handleMinChange = (val: number | string | undefined) => {
    if (val === '' || val === undefined) {
      onValueChange([min, maxValue]);
      return;
    }

    const newMin = Number(val);
    if (isNaN(newMin)) return;

    onValueChange([newMin, maxValue]);
  };

  const handleMaxChange = (val: number | string | undefined) => {
    if (val === '' || val === undefined) {
      onValueChange([minValue, max]);
      return;
    }

    const newMax = Number(val);
    if (isNaN(newMax)) return;

    onValueChange([minValue, newMax]);
  };

  const handleMinBlur = () => {
    const clamped = Math.max(min, Math.min(minValue, maxValue));
    onValueChange([clamped, maxValue]);
  };

  const handleMaxBlur = () => {
    const clamped = Math.min(max, Math.max(maxValue, minValue));
    onValueChange([minValue, clamped]);
  };

  const hasError = maxValue < minValue;

  return (
    <div className={cn(className)}>
      {title && <h4 className="font-bold">{title}:</h4>}
      <div className={`flex items-center gap-2 mt-3 ${hasError ? 'mb-1' : 'mb-3'}`}>
        <DecimalInput
          maxDecimals={0}
          value={minValue === min ? '' : minValue}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          step={step}
          hideZero={false}
          placeholder="0"
        />
        <DecimalInput
          maxDecimals={0}
          value={maxValue === max ? '' : maxValue}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          step={step}
          hideZero={false}
          placeholder="1000"
        />
      </div>
      {hasError && (
        <p className="mb-3 text-red-500 text-sm">
          Конечная стоимость должна быть больше начальной
        </p>
      )}
      <div className="relative mt-6">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          className="w-full"
        />
        <div className="-bottom-6 left-0 absolute flex justify-between px-1 w-full">
          <span className="text-gray-600 text-sm">{minValue}</span>
          <span className="text-gray-600 text-sm">{maxValue}</span>
        </div>
      </div>
    </div>
  );
}