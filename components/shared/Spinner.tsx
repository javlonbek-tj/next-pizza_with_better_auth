'use client';

export const Spinner = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-7 h-7 border-[3px] border-secondary border-t-primary rounded-full animate-spin' />
    </div>
  );
};
