import { Container } from '@/components/shared/Container';

export function StoriesSkeleton() {
  return (
    <Container className='flex items-center justify-between gap-2 my-10'>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className='bg-gray-200 rounded-md w-50 h-70 animate-pulse'
        />
      ))}
    </Container>
  );
}
