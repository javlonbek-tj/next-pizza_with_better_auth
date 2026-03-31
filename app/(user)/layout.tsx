import { Header } from '@/components/header';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-[#F4F1EE] min-h-screen'>
      <Header
        hasSearch={false}
        hasCartBtn={false}
        className='sticky top-0 z-50 bg-white'
      />
      {children}
    </div>
  );
}
