import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard() {
  /*  const session = await auth();
  if (!session?.user?.isAdmin) {
    // Assuming user has isAdmin field
    redirect('/'); // Or to login
  } */

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">150</p>{' '}
          {/* Replace with real data */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">45</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">10</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-4xl">$12,500</p>
        </CardContent>
      </Card>
    </div>
  );
}
