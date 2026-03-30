import { Title } from '../shared';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  href?: string;
  text?: string;
  message?: string;
}

export function ProductNotFound({
  href,
  text = 'На главную',
  message = 'Продукты не найдены',
}: Props) {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16'>
      <Title text={message} size='md' />
      {href && (
        <Button asChild variant='outline' className='px-6'>
          <Link href={href}>
            <ArrowLeft size={16} /> {text}
          </Link>
        </Button>
      )}
    </div>
  );
}
