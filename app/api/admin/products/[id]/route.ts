// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/prisma/prisma-client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /*  const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_PRODUCT_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
