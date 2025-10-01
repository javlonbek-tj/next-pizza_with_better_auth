'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

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
  const [range, setRange] = useState<[number, number]>(value);

  useEffect(() => {
    setRange(value);
  }, [value]);

  const handleSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    onValueChange(newRange);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input for better UX
    if (inputValue === '') {
      setRange([min, range[1]]);
      return;
    }

    let newMin = Number(inputValue);

    // Prevent invalid numbers
    if (isNaN(newMin)) return;

    // Clamp between min and max
    newMin = Math.max(min, Math.min(newMin, max));

    // Ensure min doesn't exceed current max
    newMin = Math.min(newMin, range[1]);

    const newRange: [number, number] = [newMin, range[1]];
    setRange(newRange);
    onValueChange(newRange);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input for better UX
    if (inputValue === '') {
      setRange([range[0], max]);
      return;
    }

    let newMax = Number(inputValue);

    // Prevent invalid numbers
    if (isNaN(newMax)) return;

    // Clamp between min and max - THIS IS KEY
    newMax = Math.max(min, Math.min(newMax, max));

    // Ensure max doesn't go below current min
    newMax = Math.max(newMax, range[0]);

    const newRange: [number, number] = [range[0], newMax];
    setRange(newRange);
    onValueChange(newRange);
  };

  // Handle blur to ensure valid values
  const handleMinBlur = () => {
    if (range[0] < min || isNaN(range[0])) {
      const newRange: [number, number] = [min, range[1]];
      setRange(newRange);
      onValueChange(newRange);
    }
  };

  const handleMaxBlur = () => {
    if (range[1] > max || isNaN(range[1])) {
      const newRange: [number, number] = [range[0], max];
      setRange(newRange);
      onValueChange(newRange);
    }
  };

  return (
    <div className={cn(className)}>
      {title && <p className='text-md font-bold'>{title}:</p>}
      <div className='flex items-center gap-2 mt-3 mb-5'>
        <Input
          type='number'
          value={range[0]}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          min={min}
          max={range[1]}
          step={step}
        />
        <Input
          type='number'
          value={range[1]}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          min={range[0]}
          max={max}
          step={step}
        />
      </div>
      <div className='relative mt-6'>
        <Slider
          min={min}
          max={max}
          step={step}
          value={range}
          onValueChange={handleSliderChange}
          className='w-full'
        />
        {/* Floating labels */}
        <div className='absolute -bottom-6 left-0 w-full flex justify-between px-1'>
          <span className='text-sm text-gray-600'>{range[0]}</span>
          <span className='text-sm text-gray-600'>{range[1]}</span>
        </div>
      </div>
    </div>
  );
}
