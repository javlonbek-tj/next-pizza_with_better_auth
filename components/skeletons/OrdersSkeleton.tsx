import { Container } from '@/components/shared';

export function OrdersSkeleton() {
  return (
    <Container className='py-10'>
      <div className='h-8 w-36 bg-gray-200 rounded-lg animate-pulse mb-4' />
      <div className='max-w-2xl space-y-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='h-16 bg-white rounded-2xl animate-pulse' />
        ))}
      </div>
    </Container>
  );
}
