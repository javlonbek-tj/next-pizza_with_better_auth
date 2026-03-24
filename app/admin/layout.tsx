import { AdminSidebar } from '@/components/admin';
import { AdminHeader } from '@/components/header/AdminHeader';
import { assertAdmin, requireSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  assertAdmin(session.user);

  return (
    <div className="flex flex-1 bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
