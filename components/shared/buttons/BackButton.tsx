import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  href?: string;
  text?: string;
  size?: 'sm' | 'lg' | 'default';
}

export function BackButton({
  className,
  href = '/',
  text = 'На главную',
  size = 'lg',
  ...props
}: Props) {
  return (
    <Button
      className={cn('cursor-pointer', className)}
      size={size}
      asChild
      {...props}
    >
      <Link href={href} className="flex items-center gap-2">
        <ArrowLeft className="w-5" />
        {text}
      </Link>
    </Button>
  );
}
