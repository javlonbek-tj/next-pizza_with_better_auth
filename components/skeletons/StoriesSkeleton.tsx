import { Container } from '@/components/shared/Container';

export function StoriesSkeleton() {
  return (
    <Container className='my-10'>
      <div className='flex -ml-2'>
        {[...Array(6)].map((_, index) => (
          <div key={index} className='pl-2 basis-1/3 sm:basis-1/4 lg:basis-1/6 shrink-0'>
            <div className='h-56 w-full rounded-md bg-gray-200 animate-pulse' />
          </div>
        ))}
      </div>
    </Container>
  );
}
