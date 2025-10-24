import { AdminSidebar, AdminHeader } from '@/components';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-gray-100'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminHeader />
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
