'use client';

import { Riple } from 'react-loading-indicators';

const LoadingPage = () => {
  return (
    <div className='flex py-10 justify-center h-screen'>
      <Riple color='#32cd32' size='large' />
    </div>
  );
};
export default LoadingPage;
