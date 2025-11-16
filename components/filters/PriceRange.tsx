'use client';
import { useEffect, useState } from 'react';
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
  value = [min, max],
  onValueChange,
}: Props) {
  const [minValue, setMinValue] = useState<number | ''>('');
  const [maxValue, setMaxValue] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMinValue(value[0] === min ? '' : value[0]);
    setMaxValue(value[1] === max ? '' : value[1]);
  }, [value, min, max]);

  const updateRange = (newMin: number, newMax: number) => {
    onValueChange([newMin, newMax]);
  };

  const handleMinChange = (val: number | string | undefined) => {
    if (val === '' || val === undefined) {
      setMinValue('');
      setError('');
      return;
    }

    const newMin = Number(val);
    if (isNaN(newMin)) return;

    const currentMax = maxValue === '' ? max : maxValue;

    if (newMin > currentMax) {
      setError('Конечная стоимость должна быть больше начальной');
    } else {
      setError('');
    }

    setMinValue(newMin);
  };

  const handleMaxChange = (val: number | string | undefined) => {
    if (val === '' || val === undefined) {
      setMaxValue('');
      setError('');
      return;
    }

    const newMax = Number(val);
    if (isNaN(newMax)) return;

    const currentMin = minValue === '' ? min : minValue;

    if (newMax < currentMin) {
      setError('Конечная стоимость должна быть больше начальной');
    } else {
      setError('');
    }

    setMaxValue(newMax);
  };

  const handleMinBlur = () => {
    const actualMin = minValue === '' ? min : minValue;
    const actualMax = maxValue === '' ? max : maxValue;
    const clamped = Math.max(min, Math.min(actualMin, actualMax));
    setMinValue(clamped);
    setError('');
    updateRange(clamped, actualMax);
  };

  const handleMaxBlur = () => {
    const actualMin = minValue === '' ? min : minValue;
    const actualMax = maxValue === '' ? max : maxValue;
    const clamped = Math.min(max, Math.max(actualMax, actualMin));
    setMaxValue(clamped);
    setError('');
    updateRange(actualMin, clamped);
  };

  const sliderMin = minValue === '' ? min : minValue;
  const sliderMax = maxValue === '' ? max : maxValue;

  return (
    <div className={cn(className)}>
      {title && <h4 className="font-bold">{title}:</h4>}
      <div className="flex items-center gap-2 mt-3 mb-5">
        <DecimalInput
          maxDecimals={0}
          value={minValue}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          min={min}
          max={max}
          step={step}
          hideZero={false}
          placeholder="0"
        />
        <DecimalInput
          maxDecimals={0}
          value={maxValue}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          min={min}
          max={max}
          step={step}
          hideZero={false}
          placeholder="1000"
        />
      </div>
      {error && <p className="mb-3 text-red-500 text-sm">{error}</p>}
      <div className="relative mt-6">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[sliderMin, sliderMax]}
          onValueChange={(val) => {
            setMinValue(val[0]);
            setMaxValue(val[1]);
            updateRange(val[0], val[1]);
          }}
          className="w-full"
        />
        <div className="-bottom-6 left-0 absolute flex justify-between px-1 w-full">
          <span className="text-gray-600 text-sm">{sliderMin}</span>
          <span className="text-gray-600 text-sm">{sliderMax}</span>
        </div>
      </div>
    </div>
  );
}
