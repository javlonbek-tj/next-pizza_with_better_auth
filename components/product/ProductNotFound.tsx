import Image from 'next/image';
import { Title } from '../shared';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  href: string;
  text: string;
  message?: string;
}

export function ProductNotFound({
  href,
  text,
  message = 'Страница не найдена',
}: Props) {
  return (
    <div className='flex flex-col items-center justify-start min-h-screen gap-5 text-2xl'>
      <Image
        src='/assets/images/not-found.png'
        alt='Page Not Found'
        width={300}
        height={300}
      />
      <div className='flex flex-col items-center gap-4 py-6'>
        <Title text={message} size='lg' />
        <Button asChild variant='outline' className='px-6'>
          <Link href={href}>
            <ArrowLeft size={16} /> {text}
          </Link>
        </Button>
      </div>
    </div>
  );
}
