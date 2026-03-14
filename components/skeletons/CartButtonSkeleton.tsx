import { Button } from '../ui/button';

export function CartButtonSkeleton() {
  return (
    <Button
      className='flex items-center bg-gray-400 cursor-not-allowed min-w-30'
      disabled
    >
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1'>
          <div className='w-5 h-5 bg-gray-300 rounded animate-pulse'></div>
          <div className='w-3 h-4 bg-gray-300 rounded animate-pulse'></div>
        </div>
      </div>
    </Button>
  );
}
