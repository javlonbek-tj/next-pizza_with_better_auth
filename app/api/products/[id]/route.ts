import { prisma } from '@/server/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id },
    include: {
      ingredients: true,
      productItems: { include: { size: true, type: true } },
    },
  });

  if (!product) {
    return Response.json(
      { success: false, message: 'Product not found' },
      { status: 404 },
    );
  }

  return Response.json({
    success: true,
    data: product,
  });
}
