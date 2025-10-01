import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
};

const NotFoundPage = () => {
  return (
    <div className='text-2xl flex flex-col gap-5 justify-center items-center min-h-screen'>
      <Image
        src='/assets/images/not-found.png'
        alt='Page Not Found'
        width={500}
        height={500}
      />
      <div className='flex justify-center py-6'>
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
