import { NextRequest } from 'next/server';
import { prisma } from '@/server/prisma';
import type { OrderStatus } from '@/lib/generated/prisma/enums';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(searchParams.get('limit')) || 10);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status: status as OrderStatus }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              productItem: {
                include: { product: true, size: true, type: true },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({ success: true, data: { orders, total } });
  } catch {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
