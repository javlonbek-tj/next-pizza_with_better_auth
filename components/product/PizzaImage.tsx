import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PizzaSize } from '@/lib/generated/prisma/browser';

interface Props {
  className?: string;
  imageUrl: string;
  size?: PizzaSize['size'];
}

const BASE_SIZE_CM = 30;
const BASE_IMAGE_PX = 300;

export function PizzaImage({ className, imageUrl, size = 30 }: Props) {
  const scale = size / BASE_SIZE_CM;
  const width = Math.round(BASE_IMAGE_PX * scale);
  const height = Math.round(BASE_IMAGE_PX * scale);

  return (
    <div className={cn('flex flex-1 justify-center items-center', className)}>
      <Image
        src={imageUrl}
        alt="Pizza image"
        width={width}
        height={height}
        className="transition-all duration-300"
      />
    </div>
  );
}
