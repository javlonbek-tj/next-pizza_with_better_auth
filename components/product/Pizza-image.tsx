import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  className?: string;
  imageUrl: string;
  size: 20 | 30 | 40;
}

export function PizzaImage({ className, imageUrl, size }: Props) {
  const dimensions = {
    20: { w: 300, h: 300 },
    30: { w: 400, h: 400 },
    40: { w: 450, h: 450 },
  }[size] ?? { w: 300, h: 300 };

  return (
    <div className={cn('flex flex-1 justify-center items-center', className)}>
      <Image
        src={imageUrl}
        alt='Pizza image'
        width={dimensions.w}
        height={dimensions.h}
      />
    </div>
  );
}
