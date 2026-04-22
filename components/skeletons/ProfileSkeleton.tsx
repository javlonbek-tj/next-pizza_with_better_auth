import { Container } from '@/components/shared';

export function ProfileSkeleton() {
  return (
    <Container className='py-10'>
      <div className='max-w-xl'>
        <div className='h-8 w-28 bg-gray-200 rounded-lg animate-pulse mb-6' />

        <div className='p-8 space-y-6 bg-white shadow-sm rounded-2xl'>
          <div className='flex items-center gap-5'>
            <div className='w-16 h-16 bg-gray-200 rounded-full animate-pulse shrink-0' />
            <div className='space-y-2'>
              <div className='h-5 w-36 bg-gray-200 rounded animate-pulse' />
              <div className='h-4 w-48 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>

          <hr />

          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3'>
                <div className='w-4 h-4 bg-gray-200 rounded animate-pulse shrink-0' />
                <div className='w-32 h-4 bg-gray-200 rounded animate-pulse' />
                <div className='w-24 h-4 bg-gray-200 rounded animate-pulse' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
