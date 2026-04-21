import { Suspense } from 'react';
import { AdminSidebar, AdminPageHeader } from '@/components/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-1 bg-gray-100'>
      <Suspense fallback={<div className='w-64 bg-white border-r' />}>
        <AdminSidebar />
      </Suspense>
      <div className='flex flex-col flex-1 overflow-hidden'>
        <AdminPageHeader />
        <main className='flex-1 p-6 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
