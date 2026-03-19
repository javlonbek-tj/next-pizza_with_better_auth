import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/shared';

export const metadata = {
  title: 'Page Not Found',
};

const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-5 text-2xl'>
      <Image
        src='/assets/images/not-found.png'
        alt='Page Not Found'
        width={500}
        height={500}
      />
      <div className='flex flex-col items-center gap-4 py-6'>
        <Title text='Страница не найдена' size='lg' />
        <Button asChild variant='outline' className='px-6'>
          <Link href='/'>
            <ArrowLeft size={16} /> Назад на главную
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
