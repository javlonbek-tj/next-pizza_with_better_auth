import { Button } from '../ui/button';

export function CartButtonSkeleton() {
  return (
    <Button
      className='flex items-center min-w-[120px] cursor-not-allowed bg-gray-400'
      disabled
    >
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1'>
          <div className='h-5 w-5 bg-gray-300 rounded animate-pulse'></div>
          <div className='h-4 w-3 bg-gray-300 rounded animate-pulse'></div>
        </div>
      </div>
    </Button>
  );
}
