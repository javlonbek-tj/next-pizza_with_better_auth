import { LoaderIcon } from 'lucide-react';

export function FilterLoading() {
  return (
    <div className='absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex items-start justify-center pt-20'>
      <LoaderIcon className='animate-spin' />;
    </div>
  );
}
