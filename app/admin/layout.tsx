import { Suspense } from 'react';
import { AdminSidebar, AdminPageHeader } from '@/components/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-1 bg-gray-100'>
      <Suspense>
        <AdminSidebar />
      </Suspense>
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Suspense>
          <AdminPageHeader />
        </Suspense>
        <main className='flex-1 p-6 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
