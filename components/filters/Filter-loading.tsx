import { Loader2Icon } from 'lucide-react';

export function FilterLoading() {
  return (
    <div className='absolute inset-0 flex justify-center items-center bg-white/70 backdrop-blur-[2px]'>
      <Loader2Icon className='w-6 h-6 text-gray-600 animate-spin' />
    </div>
  );
}
