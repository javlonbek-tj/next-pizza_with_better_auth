import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard() {
  /*  const session = await auth();
  if (!session?.user?.isAdmin) {
    // Assuming user has isAdmin field
    redirect('/'); // Or to login
  } */

  // Fetch some dashboard stats using Prisma
  // const prisma = new PrismaClient();
  // const productCount = await prisma.product.count();
  // etc. But for simplicity, placeholder

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold'>150</p>{' '}
          {/* Replace with real data */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold'>45</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold'>10</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold'>$12,500</p>
        </CardContent>
      </Card>
    </div>
  );
}
